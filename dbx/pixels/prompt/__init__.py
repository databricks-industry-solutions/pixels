"""Prompts Module

This module provides a Prompt class and utilities for managing system and user prompts.
Prompts are automatically loaded from the 'system/' and 'user/' subdirectories.

Example usage:

 from dbx.pixels.prompt import get_prompt

 # Fetch a system or user prompt for a specific use case
 prompt = get_prompt("vlm_ohif", "vlm_analyzer")
 print(prompt.content)

 # List all available user prompts for a use case
 user_prompts = get_user_prompts("vlm_ohif")
 for up in user_prompts:
     print(up.name, up.content)

 # List all known use cases
 use_cases = get_use_cases()
 print(use_cases)

 # Get all prompts (system and user) for a use case
 all_prompts = get_all_prompts("vlm_ohif")
 for p in all_prompts:
     print(p)

"""

import os
from typing import Literal, Optional, List, Dict
from dataclasses import dataclass

__all__ = [
    "Prompt",
    "get_all_prompts",
    "get_prompt",
    "get_system_prompts",
    "get_user_prompts",
    "get_use_cases"
]


@dataclass
class Prompt:
    """
    A class to represent a prompt for LLMs.
    
    Attributes:
        name: The name/identifier of the prompt
        content: The actual prompt text content
        description: A description of what the prompt does
        prompt_type: Whether this is a 'system' or 'user' prompt
        use_case: The use case this prompt belongs to (e.g., 'vlm_analyzer')
    """
    name: str
    content: str
    description: str
    prompt_type: Literal["system", "user"]
    use_case: str = "default"
    
    def __repr__(self) -> str:
        """Return a string representation of the Prompt."""
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return (
            f"Prompt(name='{self.name}', "
            f"use_case='{self.use_case}', "
            f"type='{self.prompt_type}', "
            f"description='{self.description}', "
            f"content='{content_preview}')"
        )
    
    def to_dict(self) -> dict:
        """Convert the Prompt to a dictionary."""
        return {
            "name": self.name,
            "content": self.content,
            "description": self.description,
            "prompt_type": self.prompt_type,
            "use_case": self.use_case
        }
    
    @classmethod
    def from_file(
        cls,
        file_path: str,
        name: Optional[str] = None,
        prompt_type: Optional[Literal["system", "user"]] = None,
        use_case: Optional[str] = None
    ) -> "Prompt":
        """
        Create a Prompt instance from a file.
        
        Args:
            file_path: Path to the prompt file
            name: Optional name for the prompt (defaults to filename without extension)
            prompt_type: Whether this is a 'system' or 'user' prompt. 
                        If None, auto-detects from folder name (system/ or user/)
            use_case: The use case this prompt belongs to.
                     If None, auto-detects from folder structure (prompts/<use_case>/system|user)
            
        Returns:
            A Prompt instance
        """
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract description from first comment line
        description = ""
        for line in content.splitlines():
            line = line.strip()
            if line.startswith("#") and len(line) > 1:
                description = line.lstrip("#").strip()
                break
        
        # Use filename without extension as name if not provided
        if name is None:
            name = os.path.splitext(os.path.basename(file_path))[0]
        
        # Auto-detect from folder structure: prompts/<use_case>/system|user
        path_parts = os.path.normpath(file_path).split(os.sep)
        
        # Auto-detect prompt type from folder if not provided
        if prompt_type is None:
            parent_dir = os.path.basename(os.path.dirname(file_path))
            if parent_dir == "system":
                prompt_type = "system"
            elif parent_dir == "user":
                prompt_type = "user"
            else:
                prompt_type = "system"  # default
        
        # Auto-detect use_case from folder structure
        if use_case is None:
            try:
                # Find 'prompts' in path and get the next folder as use_case
                if "prompts" in path_parts:
                    prompts_idx = path_parts.index("prompts")
                    if prompts_idx + 1 < len(path_parts):
                        use_case = path_parts[prompts_idx + 1]
                    else:
                        use_case = "default"
                else:
                    use_case = "default"
            except (ValueError, IndexError):
                use_case = "default"
        
        return cls(
            name=name,
            content=content,
            description=description,
            prompt_type=prompt_type,
            use_case=use_case
        )
    
    @classmethod
    def from_dict(cls, data: dict) -> "Prompt":
        """
        Create a Prompt instance from a dictionary.
        
        Args:
            data: Dictionary with keys 'name', 'content', 'description', 'prompt_type', 'use_case'
            
        Returns:
            A Prompt instance
        """
        return cls(
            name=data["name"],
            content=data["content"],
            description=data.get("description", ""),
            prompt_type=data.get("prompt_type", "system"),
            use_case=data.get("use_case", "default")
        )


# Unified prompt storage: {(use_case, name): Prompt}
_prompts_map: Dict[tuple, Prompt] = {}


def _load_prompts_from_use_case(use_case_path: str, use_case_name: str) -> None:
    """
    Load all prompts from a use case directory (system and user folders).
    
    Args:
        use_case_path: Path to the use case directory (e.g., prompts/vlm_analyzer)
        use_case_name: Name of the use case (e.g., 'vlm_analyzer')
    """
    for prompt_type in ["system", "user"]:
        folder_path = os.path.join(use_case_path, prompt_type)
        if os.path.exists(folder_path):
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                if os.path.isfile(file_path) and not file_name.endswith('.py'):
                    prompt = Prompt.from_file(file_path)  # Auto-detects everything
                    key = (prompt.use_case, prompt.name)
                    _prompts_map[key] = prompt


def _load_all_prompts() -> None:
    """
    Load all prompts from the prompts directory structure.
    Scans prompts/<use_case>/system|user for all use cases.
    """
    # Find the prompts directory relative to the resources folder
    module_dir = os.path.dirname(__file__)
    resources_dir = os.path.dirname(module_dir)
    prompts_base_dir = os.path.join(resources_dir, "resources", "prompts")
    
    if os.path.exists(prompts_base_dir):
        # Scan for use case directories
        for use_case_name in os.listdir(prompts_base_dir):
            use_case_path = os.path.join(prompts_base_dir, use_case_name)
            if os.path.isdir(use_case_path) and not use_case_name.startswith('_'):
                _load_prompts_from_use_case(use_case_path, use_case_name)


def get_all_prompts(use_case: Optional[str] = None) -> List[Prompt]:
    """
    Get all prompts (both system and user).
    
    Args:
        use_case: Optional filter by use case. If None, returns all prompts.
    
    Returns:
        List of Prompt objects
    """
    if use_case is None:
        return list(_prompts_map.values())
    return [p for p in _prompts_map.values() if p.use_case == use_case]


def get_prompt(name: str, use_case: str = "vlm_analyzer") -> Prompt:
    """
    Get a specific prompt by name and use case.
    
    Args:
        name: The name of the prompt (without file extension)
        use_case: The use case the prompt belongs to (default: 'vlm_analyzer')
        
    Returns:
        A Prompt object
        
    Raises:
        KeyError: If the prompt doesn't exist
    """
    key = (use_case, name)
    if key not in _prompts_map:
        raise KeyError(f"Prompt '{name}' not found for use case '{use_case}'")
    return _prompts_map[key]


def get_system_prompts(use_case: Optional[str] = None) -> List[Prompt]:
    """
    Get all system prompts.
    
    Args:
        use_case: Optional filter by use case. If None, returns all system prompts.
    
    Returns:
        List of system Prompt objects
    """
    prompts = [p for p in _prompts_map.values() if p.prompt_type == "system"]
    if use_case is not None:
        prompts = [p for p in prompts if p.use_case == use_case]
    return prompts


def get_user_prompts(use_case: Optional[str] = None) -> List[Prompt]:
    """
    Get all user prompts.
    
    Args:
        use_case: Optional filter by use case. If None, returns all user prompts.
    
    Returns:
        List of user Prompt objects
    """
    prompts = [p for p in _prompts_map.values() if p.prompt_type == "user"]
    if use_case is not None:
        prompts = [p for p in prompts if p.use_case == use_case]
    return prompts


def get_use_cases() -> List[str]:
    """
    Get all available use cases.
    
    Returns:
        List of use case names
    """
    return sorted(set(p.use_case for p in _prompts_map.values()))


# Auto-load all prompts from prompts/<use_case>/system|user structure
_load_all_prompts()

