"""
Tests for the Prompt class and prompt management functionality.

This test file covers:
- Prompt class initialization and methods
- Loading prompts from folder structure (prompts/<use_case>/system|user)
- Auto-detection of use_case and prompt_type
- Filtering and retrieval functions
"""

import pytest


class TestPromptClass:
    """Test the Prompt dataclass and its methods"""
    
    def test_prompt_initialization(self):
        """Test creating a Prompt instance with all required fields"""
        from dbx.pixels.prompt import Prompt
        
        prompt = Prompt(
            name="test_prompt",
            content="This is test content",
            description="Test description",
            prompt_type="system",
            use_case="test_case"
        )
        
        assert prompt.name == "test_prompt"
        assert prompt.content == "This is test content"
        assert prompt.description == "Test description"
        assert prompt.prompt_type == "system"
        assert prompt.use_case == "test_case"
    
    def test_prompt_default_use_case(self):
        """Test that use_case defaults to 'default' if not provided"""
        from dbx.pixels.prompt import Prompt
        
        prompt = Prompt(
            name="test",
            content="content",
            description="desc",
            prompt_type="user"
        )
        
        assert prompt.use_case == "default"
    
    def test_prompt_repr(self):
        """Test the string representation of a Prompt"""
        from dbx.pixels.prompt import Prompt
        
        prompt = Prompt(
            name="test",
            content="Short content",
            description="desc",
            prompt_type="system",
            use_case="my_case"
        )
        
        repr_str = repr(prompt)
        assert "test" in repr_str
        assert "my_case" in repr_str
        assert "system" in repr_str
    
    def test_prompt_repr_long_content(self):
        """Test repr truncates long content"""
        from dbx.pixels.prompt import Prompt
        
        long_content = "x" * 100
        prompt = Prompt(
            name="test",
            content=long_content,
            description="desc",
            prompt_type="user",
            use_case="case"
        )
        
        repr_str = repr(prompt)
        assert "..." in repr_str
        assert len(repr_str) < len(long_content)
    
    def test_prompt_to_dict(self):
        """Test converting a Prompt to a dictionary"""
        from dbx.pixels.prompt import Prompt
        
        prompt = Prompt(
            name="test",
            content="content",
            description="desc",
            prompt_type="system",
            use_case="my_case"
        )
        
        prompt_dict = prompt.to_dict()
        
        assert isinstance(prompt_dict, dict)
        assert prompt_dict["name"] == "test"
        assert prompt_dict["content"] == "content"
        assert prompt_dict["description"] == "desc"
        assert prompt_dict["prompt_type"] == "system"
        assert prompt_dict["use_case"] == "my_case"
    
    def test_prompt_from_dict(self):
        """Test creating a Prompt from a dictionary"""
        from dbx.pixels.prompt import Prompt
        
        data = {
            "name": "test",
            "content": "content",
            "description": "desc",
            "prompt_type": "user",
            "use_case": "my_case"
        }
        
        prompt = Prompt.from_dict(data)
        
        assert prompt.name == "test"
        assert prompt.content == "content"
        assert prompt.description == "desc"
        assert prompt.prompt_type == "user"
        assert prompt.use_case == "my_case"
    
    def test_prompt_from_dict_defaults(self):
        """Test from_dict with missing optional fields"""
        from dbx.pixels.prompt import Prompt
        
        data = {
            "name": "test",
            "content": "content"
        }
        
        prompt = Prompt.from_dict(data)
        
        assert prompt.name == "test"
        assert prompt.content == "content"
        assert prompt.description == ""
        assert prompt.prompt_type == "system"
        assert prompt.use_case == "default"
    
    def test_prompt_roundtrip(self):
        """Test converting to dict and back preserves data"""
        from dbx.pixels.prompt import Prompt
        
        original = Prompt(
            name="test",
            content="content",
            description="desc",
            prompt_type="user",
            use_case="my_case"
        )
        
        prompt_dict = original.to_dict()
        reconstructed = Prompt.from_dict(prompt_dict)
        
        assert reconstructed.name == original.name
        assert reconstructed.content == original.content
        assert reconstructed.description == original.description
        assert reconstructed.prompt_type == original.prompt_type
        assert reconstructed.use_case == original.use_case


class TestPromptFromFile:
    """Test loading prompts from files"""
    
    def test_from_file_basic(self, tmp_path):
        """Test loading a basic prompt from file"""
        from dbx.pixels.prompt import Prompt
        
        # Create a test prompt file
        prompt_file = tmp_path / "test_prompt.txt"
        prompt_file.write_text("This is the prompt content.")
        
        prompt = Prompt.from_file(
            str(prompt_file),
            prompt_type="system",
            use_case="test"
        )
        
        assert prompt.name == "test_prompt"
        assert prompt.content == "This is the prompt content."
        assert prompt.prompt_type == "system"
        assert prompt.use_case == "test"
    
    def test_from_file_with_description(self, tmp_path):
        """Test extracting description from comment"""
        from dbx.pixels.prompt import Prompt
        
        prompt_file = tmp_path / "test.txt"
        content = "# This is the description\n\nActual prompt content here."
        prompt_file.write_text(content)
        
        prompt = Prompt.from_file(
            str(prompt_file),
            prompt_type="user",
            use_case="test"
        )
        
        assert prompt.description == "This is the description"
        assert "Actual prompt content here." in prompt.content
    
    def test_from_file_auto_detect_prompt_type(self, tmp_path):
        """Test auto-detection of prompt_type from folder name"""
        from dbx.pixels.prompt import Prompt
        
        # Create system folder
        system_dir = tmp_path / "system"
        system_dir.mkdir()
        system_file = system_dir / "sys_prompt.txt"
        system_file.write_text("System prompt")
        
        prompt = Prompt.from_file(str(system_file))
        assert prompt.prompt_type == "system"
        
        # Create user folder
        user_dir = tmp_path / "user"
        user_dir.mkdir()
        user_file = user_dir / "user_prompt.txt"
        user_file.write_text("User prompt")
        
        prompt = Prompt.from_file(str(user_file))
        assert prompt.prompt_type == "user"
    
    def test_from_file_auto_detect_use_case(self, tmp_path):
        """Test auto-detection of use_case from folder structure"""
        from dbx.pixels.prompt import Prompt
        
        # Create structure: prompts/my_case/system/prompt.txt
        prompts_dir = tmp_path / "prompts" / "my_case" / "system"
        prompts_dir.mkdir(parents=True)
        prompt_file = prompts_dir / "test.txt"
        prompt_file.write_text("Test content")
        
        prompt = Prompt.from_file(str(prompt_file))
        
        assert prompt.use_case == "my_case"
        assert prompt.prompt_type == "system"
    
    def test_from_file_custom_name(self, tmp_path):
        """Test providing a custom name instead of using filename"""
        from dbx.pixels.prompt import Prompt
        
        prompt_file = tmp_path / "original_name.txt"
        prompt_file.write_text("Content")
        
        prompt = Prompt.from_file(
            str(prompt_file),
            name="custom_name",
            prompt_type="system",
            use_case="test"
        )
        
        assert prompt.name == "custom_name"
    
    def test_from_file_multiline_content(self, tmp_path):
        """Test loading multiline prompt content"""
        from dbx.pixels.prompt import Prompt
        
        prompt_file = tmp_path / "multiline.txt"
        content = """# Description here

Line 1 of prompt
Line 2 of prompt
Line 3 of prompt"""
        prompt_file.write_text(content)
        
        prompt = Prompt.from_file(
            str(prompt_file),
            prompt_type="system",
            use_case="test"
        )
        
        assert "Line 1" in prompt.content
        assert "Line 2" in prompt.content
        assert "Line 3" in prompt.content


class TestPromptRetrieval:
    """Test prompt retrieval functions"""
    
    def test_get_all_prompts_from_vlm_analyzer(self):
        """Test getting all prompts from the vlm_analyzer use case"""
        from dbx.pixels.prompt import get_all_prompts
        
        prompts = get_all_prompts(use_case="vlm_analyzer")
        
        # Should have at least the prompts we created
        assert len(prompts) >= 1
        assert all(p.use_case == "vlm_analyzer" for p in prompts)
    
    def test_get_all_prompts_no_filter(self):
        """Test getting all prompts without filtering"""
        from dbx.pixels.prompt import get_all_prompts
        
        prompts = get_all_prompts()
        
        # Should return all prompts
        assert len(prompts) >= 1
    
    def test_get_prompt_by_name(self):
        """Test getting a specific prompt by name"""
        from dbx.pixels.prompt import get_prompt
        
        # This should exist based on the test setup
        prompt = get_prompt("vlm_ohif", use_case="vlm_analyzer")
        
        assert prompt.name == "vlm_ohif"
        assert prompt.use_case == "vlm_analyzer"
        assert prompt.prompt_type == "system"
    
    def test_get_prompt_not_found(self):
        """Test getting a non-existent prompt raises KeyError"""
        from dbx.pixels.prompt import get_prompt
        
        with pytest.raises(KeyError) as exc_info:
            get_prompt("nonexistent", use_case="fake_case")
        
        assert "not found" in str(exc_info.value).lower()
    
    def test_get_system_prompts(self):
        """Test getting all system prompts"""
        from dbx.pixels.prompt import get_system_prompts
        
        prompts = get_system_prompts()
        
        assert len(prompts) >= 1
        assert all(p.prompt_type == "system" for p in prompts)
    
    def test_get_system_prompts_filtered(self):
        """Test getting system prompts filtered by use case"""
        from dbx.pixels.prompt import get_system_prompts
        
        prompts = get_system_prompts(use_case="vlm_analyzer")
        
        assert all(p.prompt_type == "system" for p in prompts)
        assert all(p.use_case == "vlm_analyzer" for p in prompts)
    
    def test_get_user_prompts(self):
        """Test getting all user prompts"""
        from dbx.pixels.prompt import get_user_prompts
        
        prompts = get_user_prompts()
        
        # Should have at least one user prompt
        assert all(p.prompt_type == "user" for p in prompts)
    
    def test_get_user_prompts_filtered(self):
        """Test getting user prompts filtered by use case"""
        from dbx.pixels.prompt import get_user_prompts
        
        prompts = get_user_prompts(use_case="vlm_analyzer")
        
        assert all(p.prompt_type == "user" for p in prompts)
        assert all(p.use_case == "vlm_analyzer" for p in prompts)
    
    def test_get_use_cases(self):
        """Test getting all available use cases"""
        from dbx.pixels.prompt import get_use_cases
        
        use_cases = get_use_cases()
        
        assert isinstance(use_cases, list)
        assert "vlm_analyzer" in use_cases
        # Should be sorted
        assert use_cases == sorted(use_cases)


class TestPromptTypes:
    """Test prompt type validation"""
    
    def test_valid_prompt_types(self):
        """Test creating prompts with valid types"""
        from dbx.pixels.prompt import Prompt
        
        system_prompt = Prompt(
            name="sys", content="c", description="d",
            prompt_type="system", use_case="test"
        )
        assert system_prompt.prompt_type == "system"
        
        user_prompt = Prompt(
            name="usr", content="c", description="d",
            prompt_type="user", use_case="test"
        )
        assert user_prompt.prompt_type == "user"


class TestIntegration:
    """Integration tests with actual prompt files"""
    
    def test_vlm_analyzer_prompts_exist(self):
        """Test that vlm_analyzer prompts are loaded"""
        from dbx.pixels.prompt import get_all_prompts, get_use_cases
        
        use_cases = get_use_cases()
        assert "vlm_analyzer" in use_cases
        
        vlm_prompts = get_all_prompts(use_case="vlm_analyzer")
        assert len(vlm_prompts) > 0
    
    def test_vlm_ohif_prompt_content(self):
        """Test the actual vlm_ohif prompt content"""
        from dbx.pixels.prompt import get_prompt
        
        prompt = get_prompt("vlm_ohif", use_case="vlm_analyzer")
        
        assert prompt.name == "vlm_ohif"
        assert prompt.prompt_type == "system"
        assert len(prompt.content) > 0
        assert len(prompt.description) > 0
        # Check for expected content
        assert "AI-powered medical assistant" in prompt.content or "VLM" in prompt.description
    
    def test_prompt_content_structure(self):
        """Test that loaded prompts have proper structure"""
        from dbx.pixels.prompt import get_all_prompts
        
        prompts = get_all_prompts()
        
        for prompt in prompts:
            # All prompts should have required fields
            assert isinstance(prompt.name, str)
            assert len(prompt.name) > 0
            assert isinstance(prompt.content, str)
            assert len(prompt.content) > 0
            assert prompt.prompt_type in ["system", "user"]
            assert isinstance(prompt.use_case, str)
            assert len(prompt.use_case) > 0

