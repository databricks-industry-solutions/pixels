import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// 1. Create a new Context
const ConfigContext = createContext();

// 2. Create a ConfigProvider component to manage all panel-specific state and logic
function ConfigProvider({ children }) {
  const [phiDetectionMethod, setPhiDetectionMethod] = useState('vlm_only');
  const [reportPhi, setReportPhi] = useState(true);
  const [privacyEnhancePixels, setPrivacyEnhancePixels] = useState(true);
  const [actionType, setActionType] = useState('redact');
  const [scopeType, setScopeType] = useState('all_text');
  const [selectedVlmEndpoint, setSelectedVlmEndpoint] = useState('databricks-claude-3-7-sonnet');
  const [dicomFilePath, setDicomFilePath] = useState(''); // New state for DICOM file path

  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Define VLM endpoints for the dropdown
  const vlmEndpoints = [
    { value: 'databricks-claude-3-7-sonnet', label: 'databricks-claude-3-7-sonnet' },
    { value: '', label: 'Select Endpoint' },
    { value: 'databricks-claude-sonnet-4', label: 'databricks-claude-sonnet-4' },
    { value: 'llama-3.2-11b-vision-instruct', label: 'llama-3.2-11b-vision-instruct' },
    { value: 'qwen/qwen2.5-vl-7b-instruct', label: 'qwen/qwen2.5-vl-7b-instruct' },
  ];

  // Define PHI Detection Methods for the new dropdown
  const phiDetectionMethods = [
    { value: 'vlm_only', label: 'VLM' },
    { value: 'presidio', label: 'Presidio' },
    { value: 'none', label: 'None' },
  ];

  // Effect for privacyEnhancePixels switch enabling/disabling radio buttons and DICOM path input
  useEffect(() => {
    if (!privacyEnhancePixels) {
      setActionType(''); // Reset action type
      setScopeType('');   // Reset scope type
      setDicomFilePath(''); // Reset DICOM file path
    } else {
      // If privacyEnhancePixels is turned on, set actionType and scopeType to their defaults if not already set
      if (!actionType) setActionType('redact');
      if (!scopeType) setScopeType('all_text');
    }
  }, [privacyEnhancePixels, actionType, scopeType, setActionType, setScopeType, setDicomFilePath]); // Added setDicomFilePath to dependency array

  // Effect for VLM Endpoint dropdown enabling/disabling based on PHI Detection Method
  useEffect(() => {
    if (phiDetectionMethod && (!phiDetectionMethod.includes('vlm') || phiDetectionMethod === 'none')) {
      setSelectedVlmEndpoint(''); // Reset VLM endpoint if method doesn't include VLM or is 'None'
    } else if (phiDetectionMethod.includes('vlm') && !selectedVlmEndpoint) {
      setSelectedVlmEndpoint('databricks-claude-3-7-sonnet'); // Set default if VLM method selected but no endpoint chosen
    }
  }, [phiDetectionMethod, selectedVlmEndpoint, setSelectedVlmEndpoint]);

  // The handleRun logic now accepts the endpoint as a parameter
  const handleRun = useCallback(async (endpoint) => { // Added 'endpoint' parameter
    setIsLoading(true);
    setResponseMessage('');

    // Determine if controls are disabled due to PHI Detection Method being 'None'
    const controlsDisabledByPhiMethod = phiDetectionMethod === 'none';

    const payload = {
      phi_detection_method: phiDetectionMethod,
      // Pass null for dependent controls if PHI detection is 'None'
      report_phi_found_in_image_pixels: controlsDisabledByPhiMethod ? null : reportPhi,
      privacy_enhance_image_pixels: controlsDisabledByPhiMethod ? null : privacyEnhancePixels,
      action_type: controlsDisabledByPhiMethod || !privacyEnhancePixels ? null : actionType,
      scope_type: controlsDisabledByPhiMethod || !privacyEnhancePixels ? null : scopeType,
      selected_vlm_endpoint: (controlsDisabledByPhiMethod || !phiDetectionMethod.includes('vlm') || phiDetectionMethod === 'none') ? null : selectedVlmEndpoint,
      dicom_file_path: controlsDisabledByPhiMethod || !privacyEnhancePixels ? null : dicomFilePath,
    };

    console.log(`Sending payload to backend: ${endpoint}`, payload);

    try {
      const response = await fetch(`${endpoint}`, { // Use the endpoint parameter
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        setResponseMessage(`Success: ${result.message || 'Operation completed.'}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to get response from backend:', response.status, response.statusText, errorText);
        setResponseMessage(`Error: Failed (${response.status} ${response.statusText}). Check backend console.`);
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setResponseMessage(`Network Error: Could not connect to backend. Is it running on http://127.0.0.1:8000?`);
    } finally {
      setIsLoading(false);
    }
  }, [phiDetectionMethod, reportPhi, privacyEnhancePixels, actionType, scopeType, selectedVlmEndpoint, dicomFilePath]);

  const contextValue = {
    phiDetectionMethod, setPhiDetectionMethod,
    reportPhi, setReportPhi,
    privacyEnhancePixels, setPrivacyEnhancePixels,
    actionType, setActionType,
    scopeType, setScopeType,
    selectedVlmEndpoint, setSelectedVlmEndpoint,
    dicomFilePath, setDicomFilePath, // Provide new state and setter
    vlmEndpoints, phiDetectionMethods,
    isLoading, responseMessage, handleRun, // Provide run status and function
    setIsLoading, setResponseMessage // Allow panel to update these if needed (though run handles it)
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}


// ProtectImagePanel component now consumes state from Context
function ProtectImagePanel() {
  // Consume state and setters from context
  const {
    phiDetectionMethod, setPhiDetectionMethod,
    reportPhi, setReportPhi,
    privacyEnhancePixels, setPrivacyEnhancePixels,
    actionType, setActionType,
    scopeType, setScopeType,
    selectedVlmEndpoint, setSelectedVlmEndpoint,
    dicomFilePath, setDicomFilePath,
    vlmEndpoints, phiDetectionMethods
  } = useContext(ConfigContext); // Use useContext to get the values

  // Determine if controls should be disabled due to PHI Detection Method being 'None'
  const controlsDisabledByPhiMethod = phiDetectionMethod === 'none';

  // Switch component (remains mostly the same)
  const Switch = ({ id, label, checked, onChange, disabled = false, indented = false }) => (
    <div className={`flex items-center bg-white p-4 rounded-xl shadow-md transition transform hover:translate-y-[-2px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <span className={`flex-grow text-lg font-medium text-gray-800 ${indented ? 'ml-8' : ''}`}>
        {label}
      </span>
      <label htmlFor={id} className="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="opacity-0 w-0 h-0 peer"
        />
        <span className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-400 peer-checked:bg-blue-600"></span>
        <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-400 peer-checked:translate-x-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2"></span>
      </label>
    </div>
  );

  // RadioGroup component
  const RadioGroup = ({ label, name, options, selectedValue, onChange, disabled }) => (
    <div className={`flex flex-col space-y-3 p-4 bg-white rounded-xl shadow-md transition transform hover:translate-y-[-2px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <span className="block text-lg font-medium text-gray-800 mb-2">
        {label}
      </span>
      <div className="flex justify-end space-x-4">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center cursor-pointer text-base font-medium text-gray-800">
            <span>{option.label}</span>
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600 ml-2"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </div>
  );


  return (
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col overflow-hidden">
        {/* Top band with red background and title */}
        <div className="bg-[#8B1C2A] text-white p-4 rounded-t-xl -mx-8 -mt-8 mb-8">
            <h1 className="text-3xl font-bold text-center">Protect - Image</h1>
        </div>

        {/* PHI detection method and VLM Endpoint Dropdowns combined in one container */}
        <div className={`mb-6 bg-white p-4 rounded-xl shadow-md transition transform hover:translate-y-[-2px] flex flex-col space-y-4 ${controlsDisabledByPhiMethod ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {/* PHI detection method dropdown */}
            <div className="flex items-center justify-between">
                <label htmlFor="phiDetectionMethod" className="text-lg font-medium text-gray-800">
                    PHI detection method
                </label>
                <select
                    id="phiDetectionMethod"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium w-[19.2rem]"
                    value={phiDetectionMethod}
                    onChange={(e) => setPhiDetectionMethod(e.target.value)}
                >
                    {phiDetectionMethods.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* VLM Endpoint Dropdown - directly below PHI Detection Method within the same box */}
            <div className="flex justify-end">
              <select
                id="vlmEndpoint"
                className={`p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium w-[19.2rem] ${(!phiDetectionMethod || !phiDetectionMethod.includes('vlm') || controlsDisabledByPhiMethod) ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={selectedVlmEndpoint}
                onChange={(e) => setSelectedVlmEndpoint(e.target.value)}
                disabled={!phiDetectionMethod || !phiDetectionMethod.includes('vlm') || controlsDisabledByPhiMethod} // Disabled by PHI method or 'None'
              >
                {vlmEndpoints.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
        </div>

        {/* Switch One: Generate PHI assessment */}
        <div className="mb-6">
          <Switch
            id="switch1"
            label="Generate PHI assessment"
            checked={reportPhi}
            onChange={(e) => setReportPhi(e.target.checked)}
            disabled={controlsDisabledByPhiMethod}
          />
        </div>

        {/* Switch Two: Apply pixel protection */}
        <div className="mb-6">
            <Switch
                id="switch2"
                label="Apply pixel protection"
                checked={privacyEnhancePixels}
                onChange={(e) => setPrivacyEnhancePixels(e.target.checked)}
                disabled={controlsDisabledByPhiMethod}
            />
            {/* Text box for DICOM file path */}
            <div className={`mt-4 flex flex-col items-start ${(!privacyEnhancePixels || controlsDisabledByPhiMethod) ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="dicomFilePath" className="text-lg font-medium text-gray-800 mb-2">
                    Save folder for protected image files:
                </label>
                <input
                    type="text"
                    id="dicomFilePath"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium w-full"
                    value={dicomFilePath}
                    onChange={(e) => setDicomFilePath(e.target.value)}
                    placeholder="e.g., /Volumes/<catalog>/<schema>/volume/folder"
                    disabled={!privacyEnhancePixels || controlsDisabledByPhiMethod}
                />
            </div>
        </div>


        {/* New Radio Button Groups */}
        <div className="space-y-6 mt-6">
          <RadioGroup
            label={
                <>
                    Highlight text [draw bounding box around text] or<br />
                    Redact text [draw opaque box on top of text]
                </>
            }
            name="actionType"
            options={[
              { label: 'Highlight', value: 'highlight' },
              { label: 'Redact', value: 'redact' },
            ]}
            selectedValue={actionType}
            onChange={setActionType}
            disabled={!privacyEnhancePixels || controlsDisabledByPhiMethod}
          />

          <RadioGroup
            label="Apply privacy action PHI Text or to All Text"
            name="scopeType"
            options={[
              { label: 'PHI Text', value: 'phi_only' },
              { label: 'All Text', value: 'all_text' },
            ]}
            selectedValue={scopeType}
            onChange={setScopeType}
            disabled={!privacyEnhancePixels || controlsDisabledByPhiMethod}
          />
        </div>
    </div>
  );
}


// Main App component to manage navigation and the master switch
function App() {
    const [activeTab, setActiveTab] = useState('Protect-Image'); // Default active tab

    const tabs = [
        "Acquire", "Ingest", "Index", "Protect-Metadata", "Protect-Image", "Feature Extraction", "AI/BI", "Viewer"
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* ConfigProvider wraps the main content */}
            <ConfigProvider>
                {/* Top dark teal header bar with title and Config button */}
                <AppHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

                {/* Content Area */}
                <main className="flex-grow flex justify-center items-center p-4 w-full">
                    {activeTab === 'Protect-Image' && (
                        <ProtectImagePanel />
                    )}
                    {activeTab !== 'Protect-Image' && (
                        <div className={`p-8 bg-white rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex items-center justify-center min-h-[400px] text-center text-gray-600`}>
                            <p className="text-xl">
                                Content for {activeTab} tab will go here.
                            </p>
                        </div>
                    )}
                </main>

                {/* Response Message area moved to App component */}
                <AppFooter />
            </ConfigProvider>
        </div>
    );
}

// AppHeader component for the top bar
function AppHeader({ activeTab, setActiveTab, tabs }) {
    const { isLoading, handleRun } = useContext(ConfigContext);

    return (
        <>
            {/* Top dark teal header bar with title and Config button */}
            <div className="bg-[#2a4352] text-white p-4 w-full flex justify-between items-center shadow-lg">
                <h1 className="text-3xl font-bold text-left ml-4">Pixels Configurator</h1>
                {/* Run button added to the left of Config */}
                <div className="flex items-center space-x-4">
                    <button
                        id="runButton"
                        onClick={() => handleRun('/run')} // Pass '/run' endpoint
                        disabled={isLoading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Running...' : 'Run'}
                    </button>
                    <button
                        id="configButton"
                        onClick={() => handleRun('/config')} // Pass '/config' endpoint
                        disabled={isLoading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Configuring...' : 'Config'}
                    </button>
                </div>
            </div>

            {/* Navigation Ribbon */}
            <nav className="w-full bg-gray-800 shadow-md">
                <ul className="flex justify-center flex-wrap">
                    {tabs.map((tab) => (
                        <li key={tab} className="relative">
                            {/* Color bar indicator - now always blue */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md bg-blue-500`}></div>
                            <button
                                className={`pl-8 pr-6 py-3 text-lg font-medium transition-colors duration-200 flex items-center justify-between w-full
                                    ${activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } focus:outline-none`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span>{tab}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

// AppFooter component for the response message
function AppFooter() {
    const { responseMessage } = useContext(ConfigContext);
    return (
        responseMessage && (
            <div className={`mt-4 p-3 rounded-lg text-center ${responseMessage.startsWith('Error') || responseMessage.startsWith('Network Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} w-full max-w-md md:max-w-lg lg:max-w-xl`}>
                {responseMessage}
            </div>
        )
    );
}


export default App;
