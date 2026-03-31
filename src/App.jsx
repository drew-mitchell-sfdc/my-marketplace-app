import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Cloud, User, Mail, Hash, Plus, Trash2, X, FileUp, 
  CheckCircle2, FileText, Upload, Loader2, ShieldCheck, AlertCircle, 
  Clock, Send, Download, FileDown, Settings, RefreshCcw, LifeBuoy, 
  Server, ClipboardCheck, AlertTriangle, Info, ChevronDown, Menu,
  Search, CheckCircle, Briefcase, Edit2, HelpCircle, Printer, Minus, RotateCw, MoreVertical
} from 'lucide-react';

// --- SHARED COMPONENTS FOR CASE INTAKE ---

const Label = ({ children, required = true }) => (
  <label className="block text-[#232f3e] text-[15px] mb-1 font-medium">
    {required && <span className="text-[#d13212] mr-1 font-bold">*</span>}
    {children}
  </label>
);

const HelperText = ({ children }) => (
  <p className="text-[#545b64] text-[13px] mt-1">{children}</p>
);

const SearchField = ({ name, value, label, required = true, suggestions = [], onChange, hasError }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val, type: 'text' } });
    setShowDropdown(false);
  };

  return (
    <section className="relative" ref={dropdownRef}>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <input
          type="text"
          name={name}
          placeholder="Search"
          autoComplete="off"
          value={value}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            onChange(e);
            setShowDropdown(true);
          }}
          className={`w-full border rounded p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${hasError ? 'border-[#d13212]' : 'border-gray-400'}`}
        />
        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
      </div>
      
      {showDropdown && value.length > 0 && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
          {filteredSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 text-[14px] hover:bg-[#f3f3f3] cursor-pointer flex items-center gap-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-gray-900 font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const CaseDetailRow = ({ label, value, isLink = false, showIcon = false, icon: Icon }) => (
  <div className="flex border-b border-gray-100 py-2 group cursor-default">
    <div className="w-1/3 text-gray-600 text-[13px] flex items-center gap-1">
      {label}
      {showIcon && <Info size={12} className="text-gray-400" />}
    </div>
    <div className="w-2/3 text-[13px] text-gray-900 flex justify-between items-center pr-2">
      <span className={isLink ? "text-[#0066cc] hover:underline cursor-pointer" : ""}>
        {Icon && <Icon size={14} className="inline mr-1 text-gray-500" />}
        {value || ''}
      </span>
      <Edit2 size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

// --- CASE INTAKE FLOW COMPONENT ---
const CaseIntakeFlow = ({ onBack, initialQuoteId }) => {
  const [formData, setFormData] = useState({
    selectedMarketplace: 'AWS Marketplace',
    purpose: 'Publishing Bypass Request',
    quoteNumber: initialQuoteId || '',
    awsAccountId: '',
    externalIdInOpportunity: false,
    screenshotUploaded: false,
    contactName: '',
    contactEmail: '',
    confirmedFaq: false,
    questionPertainsTo: '',
    accountName: '',
    opportunityName: '',
    quoteName: '',
    issueDescription: '',
    typeOfException: '',
    exceptionDetails: '',
    additionalComments: '',
    hasWrittenApproval: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const mockQuotes = [
    "Q-11474510", "Q-50213384", "Q-88273641", "Q-33491205", "Q-99182736", initialQuoteId
  ].filter(Boolean);

  const vendor = formData.selectedMarketplace === 'AWS Marketplace' ? 'AWS' : 'GCP';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.selectedMarketplace) newErrors.selectedMarketplace = 'Required';
    
    if (formData.purpose === 'Publishing Bypass Request') {
      if (!formData.quoteNumber) newErrors.quoteNumber = 'Required';
      if (!formData.typeOfException) newErrors.typeOfException = 'Required';
      if (formData.typeOfException !== 'Custom Term Review') {
        if (!formData.exceptionDetails) newErrors.exceptionDetails = 'Required';
        if (!formData.hasWrittenApproval) newErrors.hasWrittenApproval = 'Required';
      }
    } else if (formData.purpose === 'Create Private Offer') {
      if (!formData.quoteNumber) newErrors.quoteNumber = 'Required';
      if (!formData.awsAccountId) newErrors.awsAccountId = 'Required';
      if (!formData.externalIdInOpportunity) newErrors.externalIdInOpportunity = 'Required';
      if (!formData.screenshotUploaded) newErrors.screenshotUploaded = 'Required';
      if (!formData.contactName) newErrors.contactName = 'Required';
      if (!formData.contactEmail) newErrors.contactEmail = 'Required';
      if (!formData.confirmedFaq) newErrors.confirmedFaq = 'Required';
    } else {
      if (!formData.questionPertainsTo) newErrors.questionPertainsTo = 'Required';
      if (!formData.accountName) newErrors.accountName = 'Required';
      if (!formData.opportunityName) newErrors.opportunityName = 'Required';
      if (!formData.issueDescription) newErrors.issueDescription = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    if (formData.purpose === 'Create Private Offer' || formData.purpose === 'Publishing Bypass Request') {
      let generatedDescription = '';

      if (formData.purpose === 'Publishing Bypass Request') {
        generatedDescription = `Selected Marketplace: ${formData.selectedMarketplace}\nRelated Quote #: ${formData.quoteNumber}\nType of Exception: ${formData.typeOfException}`;
        if (formData.typeOfException !== 'Custom Term Review') {
          generatedDescription += `\nException Details: ${formData.exceptionDetails}\nHas written approval from AWS?: ${formData.hasWrittenApproval}`;
        }
        generatedDescription += `\nAdditional Comments: ${formData.additionalComments}`;
      } else {
        generatedDescription = `Selected Marketplace: ${formData.selectedMarketplace}
${vendor} ID for the Account you would like offer sent to: ${formData.awsAccountId}
The ${vendor} ID is populated in the Public Cloud External Identifier field on the Opportunity: ${formData.externalIdInOpportunity}
A screenshot of the ${vendor} ID and Tax Address has been uploaded to the Files section of the Opportunity.: ${formData.screenshotUploaded}
Provide the full name of the individual accepting the Private Offer.: ${formData.contactName}
Provide the email of the individual accepting the Private Offer.: ${formData.contactEmail}
I confirm I have read the ${vendor} FAQ and will adhere to all Program restrictions.: ${formData.confirmedFaq}`;
      }

      return (
        <div className="min-h-screen bg-[#f3f3f3] font-sans pb-10 animate-in fade-in duration-300">
          <div className="bg-white border-b border-gray-200">
            <div className="p-4 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#e84e40] rounded flex items-center justify-center shadow-inner">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-[12px] text-gray-600 leading-tight">Case</div>
                  <h1 className="text-[18px] font-bold text-gray-900 leading-tight">{formData.purpose}</h1>
                </div>
              </div>
              <div className="flex gap-16 text-center pr-8">
                <div><div className="text-[12px] text-gray-500">Priority</div><div className="text-[14px]">Normal</div></div>
                <div><div className="text-[12px] text-gray-500">Status</div><div className="text-[14px]">New</div></div>
                <div><div className="text-[12px] text-gray-500">Case Number</div><div className="text-[14px]">50141005</div></div>
              </div>
            </div>
            
            <div className="flex px-4 border-b border-gray-200 bg-[#f7f9fb] shadow-inner">
              {['Details', 'Related', 'Collaboration', 'Operations'].map((tab, i) => (
                <div key={tab} className={`px-4 py-2 text-[13px] font-medium cursor-pointer border-b-2 transition-all ${i === 0 ? 'border-[#006dcc] text-[#006dcc] bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto mt-4 px-4">
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-x-12 gap-y-1">
                <CaseDetailRow label="Case Owner" value="Booking Operations" />
                <CaseDetailRow label="Case Number" value="50141005" />
                <CaseDetailRow label="Requestor" value="Drew Mitchell" isLink />
                <CaseDetailRow label="Status" value="New" showIcon />
                <CaseDetailRow label="Contact Name" value="Drew Mitchell" isLink showIcon />
                <CaseDetailRow label="Priority" value="Normal" showIcon />
                <CaseDetailRow label="Case Reason" value={`${vendor} Marketplace Private Offer`} showIcon />
                <CaseDetailRow label="Case Origin" value="Ask Astro" showIcon />
                <CaseDetailRow label="Secondary Reason" value={`${vendor} PO`} />
                <CaseDetailRow label="Case Record Type" value="Booking Operations" showIcon />
                <CaseDetailRow label="Account Name" value="Mitchell Woodworking" isLink showIcon />
                <CaseDetailRow label="Comments" value="" />
                <CaseDetailRow label="Quote (CPQ)" value={formData.quoteNumber || initialQuoteId} isLink />
                <CaseDetailRow label="Partner Order" value="" showIcon />
                <CaseDetailRow label="Contract #" value="" />
                <CaseDetailRow label="Parent Case" value="" showIcon />
                <CaseDetailRow label="Related Opportunity" value="Mitchell Woodworking - Quick Add-on" isLink />
                <CaseDetailRow label="Partner Case OrgID" value="" showIcon />
                <CaseDetailRow label="Order Number" value="" />
                <CaseDetailRow label="Effective Date" value="" />
              </div>

              <div className="mt-4">
                <div className="bg-[#f3f3f3] px-4 py-2 flex items-center gap-2 border-y border-gray-200">
                  <ChevronDown size={14} className="text-gray-600" />
                  <span className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Description</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex group cursor-default border-b border-gray-50 pb-2">
                    <div className="w-1/3 text-gray-600 text-[13px] flex items-center gap-1">Subject <HelpCircle size={12} className="text-gray-400" /></div>
                    <div className="w-2/3 text-[13px] text-gray-900 flex justify-between"><span>{formData.purpose}</span><Edit2 size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  </div>
                  <div className="flex group cursor-default pt-2">
                    <div className="w-1/3 text-gray-600 text-[13px] flex items-center gap-1">Description <HelpCircle size={12} className="text-gray-400" /></div>
                    <div className="w-2/3 text-[13px] text-gray-800 flex justify-between">
                      <pre className="font-sans whitespace-pre-wrap leading-relaxed">{generatedDescription}</pre>
                      <Edit2 size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
               <button onClick={() => setSubmitted(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-1.5 rounded text-[13px] font-medium hover:bg-gray-50 shadow-sm">Go Back to Form</button>
               <button onClick={onBack} className="bg-[#0073bb] border border-[#0073bb] text-white px-6 py-1.5 rounded text-[13px] font-medium hover:bg-[#005a91] shadow-sm">Return to Quote</button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Inquiry Submitted</h2>
            <p className="text-gray-600 mb-6">Your Deal Inquiry has been logged as Case #50141006.</p>
            <div className="flex flex-col gap-2">
                <button onClick={() => setSubmitted(false)} className="w-full bg-[#0073bb] text-white px-6 py-2 rounded font-medium hover:bg-[#005a91]">Return to Intake</button>
                <button onClick={onBack} className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50">Exit to Quote Validation</button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#232f3e] p-4 md:p-8 animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-[#0073bb] hover:bg-blue-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex justify-between items-start">
            <h1 className="text-[#004b7d] text-2xl font-semibold">Marketplace Private Offer Intake Form</h1>
            <span className="text-[#d13212] text-sm font-medium mt-1">* Required fields</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <Label>Select Marketplace</Label>
            <div className="space-y-2 mt-2">
              {['AWS Marketplace', 'GCP Marketplace'].map(option => (
                <label key={option} className={`flex items-center group ${option === 'GCP Marketplace' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input 
                    type="radio" 
                    name="selectedMarketplace" 
                    value={option} 
                    checked={formData.selectedMarketplace === option} 
                    onChange={handleInputChange} 
                    disabled={option === 'GCP Marketplace'}
                    className="w-4 h-4 text-[#0073bb] focus:ring-[#0073bb] border-gray-300 disabled:bg-gray-200" 
                  />
                  <span className={`ml-2 text-gray-700 ${option === 'GCP Marketplace' ? '' : 'group-hover:text-black transition-colors'}`}>{option}</span>
                </label>
              ))}
            </div>
            {errors.selectedMarketplace && <p className="text-[#d13212] text-xs mt-1">Please select a marketplace.</p>}
          </section>

          <section>
            <Label>Purpose of case</Label>
            <div className="space-y-2 mt-2">
              {['Publishing Bypass Request', 'Create Private Offer', 'Deal Inquiry'].map(option => (
                <label key={option} className="flex items-center cursor-pointer group">
                  <input type="radio" name="purpose" value={option} checked={formData.purpose === option} onChange={handleInputChange} className="w-4 h-4 text-[#0073bb] focus:ring-[#0073bb] border-gray-300" />
                  <span className="ml-2 text-gray-700 group-hover:text-black transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {formData.purpose === 'Publishing Bypass Request' && (
            <>
              <SearchField name="quoteNumber" value={formData.quoteNumber} label="Related Quote #" suggestions={mockQuotes} onChange={handleInputChange} hasError={errors.quoteNumber} />
              
              <section>
                <Label>Type of Exception</Label>
                <select name="typeOfException" value={formData.typeOfException} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white ${errors.typeOfException ? 'border-[#d13212]' : 'border-gray-400'}`}>
                   <option value="" disabled>-- Select an exception type --</option>
                   <option value="Ineligible Product">Ineligible Product</option>
                   <option value="Hyperforce Exception">Hyperforce Exception</option>
                   <option value="On-Premise Deployment Exception">On-Premise Deployment Exception</option>
                   <option value="Custom Term Review">Custom Term Review</option>
                   <option value="Other">Other</option>
                </select>
              </section>

              {formData.typeOfException !== 'Custom Term Review' && (
                <>
                  <section>
                    <Label>Exception Details</Label>
                    <input type="text" name="exceptionDetails" value={formData.exceptionDetails} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.exceptionDetails ? 'border-[#d13212]' : 'border-gray-400'}`} />
                    {formData.typeOfException === 'Ineligible Product' && <HelperText>Input Product name(s) separated by comma.</HelperText>}
                    {formData.typeOfException === 'Hyperforce Exception' && <HelperText>Anticipated migration date (<a href="https://sfdc.co/org-migration-schedule-search" target="_blank" rel="noreferrer" className="text-[#006dcc] hover:underline font-normal">Org Migration Schedule Search</a>)</HelperText>}
                    {formData.typeOfException === 'On-Premise Deployment Exception' && <HelperText>Provide details on the customer's current deployment and ask.</HelperText>}
                    {formData.typeOfException === 'Other' && <HelperText>Please describe the exception you are seeking.</HelperText>}
                  </section>

                  <section>
                    <Label>Do you have written approval from AWS for the requested exception? If so, ensure it is attached to the Opportunity.</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      {['Yes', 'No'].map(val => (
                        <label key={val} className="flex items-center cursor-pointer">
                          <input type="radio" name="hasWrittenApproval" value={val} checked={formData.hasWrittenApproval === val} onChange={handleInputChange} className="w-4 h-4 text-[#0073bb] border-gray-300" />
                          <span className="ml-2 text-gray-700">{val}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <section>
                <Label required={false}>Additional Comments</Label>
                <textarea name="additionalComments" rows="3" value={formData.additionalComments} onChange={handleInputChange} className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] resize-none" />
              </section>
            </>
          )}

          {formData.purpose === 'Create Private Offer' && (
            <>
              <SearchField name="quoteNumber" value={formData.quoteNumber} label="Related Quote #" suggestions={mockQuotes} onChange={handleInputChange} hasError={errors.quoteNumber} />
              <section>
                <Label>{vendor} ID for the Account you would like offer sent to</Label>
                <input type="text" name="awsAccountId" value={formData.awsAccountId} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.awsAccountId ? 'border-[#d13212]' : 'border-gray-400'}`} />
              </section>

              <section>
                <label className="flex items-start cursor-pointer">
                  <div className="mt-1"><span className="text-[#d13212] font-bold mr-1">*</span><input type="checkbox" name="externalIdInOpportunity" checked={formData.externalIdInOpportunity} onChange={handleInputChange} className={`w-4 h-4 text-[#0073bb] rounded focus:ring-[#0073bb] ${errors.externalIdInOpportunity ? 'border-[#d13212]' : 'border-gray-300'}`} /></div>
                  <span className="ml-2 text-[15px] text-gray-700">The {vendor} ID is populated in the Public Cloud External Identifier field on the Opportunity</span>
                </label>
              </section>

              <section>
                <label className="flex items-start cursor-pointer">
                  <div className="mt-1"><span className="text-[#d13212] font-bold mr-1">*</span><input type="checkbox" name="screenshotUploaded" checked={formData.screenshotUploaded} onChange={handleInputChange} className={`w-4 h-4 text-[#0073bb] rounded focus:ring-[#0073bb] ${errors.screenshotUploaded ? 'border-[#d13212]' : 'border-gray-300'}`} /></div>
                  <span className="ml-2 text-[15px] text-gray-700">A screenshot of the {vendor} ID and Tax Address has been uploaded to the Files section of the Opportunity.</span>
                </label>
              </section>
              
              <section>
                <Label>Provide the full name of the individual accepting the Private Offer.</Label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.contactName ? 'border-[#d13212]' : 'border-gray-400'}`} />
              </section>

              <section>
                <Label>Provide the email of the individual accepting the Private Offer.</Label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.contactEmail ? 'border-[#d13212]' : 'border-gray-400'}`} />
              </section>

              <section>
                <label className="flex items-start cursor-pointer">
                  <div className="mt-1"><span className="text-[#d13212] font-bold mr-1">*</span><input type="checkbox" name="confirmedFaq" checked={formData.confirmedFaq} onChange={handleInputChange} className="w-4 h-4 text-[#0073bb] rounded border-gray-300 focus:ring-[#0073bb]" /></div>
                  <span className="ml-2 text-[15px] text-gray-700">I confirm I have read the {vendor} FAQ and will adhere to all Program restrictions.</span>
                </label>
              </section>
            </>
          )}

          {formData.purpose === 'Deal Inquiry' && (
            <>
              <section>
                <Label>What does your question pertain to?</Label>
                <input type="text" name="questionPertainsTo" value={formData.questionPertainsTo} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.questionPertainsTo ? 'border-[#d13212]' : 'border-gray-400'}`} />
                <HelperText>Help understanding a payment schedule, invoicing, SELA review, swap/transfer request</HelperText>
              </section>
              <SearchField name="accountName" value={formData.accountName} label="Account Name" onChange={handleInputChange} hasError={errors.accountName} />
              <SearchField name="opportunityName" value={formData.opportunityName} label="Opportunity Name" onChange={handleInputChange} hasError={errors.opportunityName} />
              <SearchField name="quoteName" value={formData.quoteName} label="Quote Name" required={false} onChange={handleInputChange} />
              <section>
                <Label>Description of Issue</Label>
                <textarea name="issueDescription" rows="4" value={formData.issueDescription} onChange={handleInputChange} className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] ${errors.issueDescription ? 'border-[#d13212]' : 'border-gray-400'}`} />
              </section>
            </>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded flex items-center gap-3 text-red-700 animate-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Please fill in all required fields marked with *</p>
            </div>
          )}

          <div className="pt-4 pb-12">
            <button type="submit" className="bg-[#0073bb] text-white px-8 py-2.5 rounded text-[15px] font-semibold hover:bg-[#005a91] transition-colors shadow-sm">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/**
 * MAIN APP ENTRY POINT
 */
export default function App() {
  // Navigation View State
  const [view, setView] = useState('crm_quote'); 
  
  // Demo Scenario States
  const [scenario, setScenario] = useState('success'); // Validation: success, fail, hyperforce, custom_qst
  const [trackingScenario, setTrackingScenario] = useState('standard'); // Tracking: standard, review
  const [docusignScenario, setDocusignScenario] = useState('awaiting'); // DocuSign: awaiting, received
  
  // UI Interaction States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offerStatus, setOfferStatus] = useState('uploading'); // uploading, created, draft
  const [deliveryMethod, setDeliveryMethod] = useState('none'); 
  const [signatureBlocks, setSignatureBlocks] = useState(1);
  const [statusMessage, setStatusMessage] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState('Approved'); // CRM quote status
  const [hasCreatedOffer, setHasCreatedOffer] = useState(false); // Indicates if the Private Offer tracking sequence has completed

  // Bypass States
  const [marketplaceValidationsBypass, setMarketplaceValidationsBypass] = useState(false);
  const [marketplaceValidationsBypassReason, setMarketplaceValidationsBypassReason] = useState('');
  const [marketplaceCustomTermBypass, setMarketplaceCustomTermBypass] = useState(false);
  const [marketplaceCustomTermBypassReason, setMarketplaceCustomTermBypassReason] = useState('');

  // Docusign State
  const [docusignForm, setDocusignForm] = useState({
    from: 'Drew Mitchell',
    signer1: 'Sally Sales (sallysales@salesforce.com)',
    cc: '',
    inPerson: false,
    subject: `Q-11128001 from salesforce.com`,
    message: `To begin the process of reviewing and signing your documents via DocuSign, please click on the 'Sign Now' link below. Signing will not be complete until you have reviewed the agreement and have confirmed your signature.\n\nThis signature is not binding. A Private Offer must still be accepted in the AWS Marketplace.\n\nPlease let me know if you have any questions.\n\nThank you,\nDrew Mitchell`
  });

  const initialSteps = [
    { id: 1, label: 'Checking Opportunity Values', status: 'loading' },
    { id: 2, label: 'Validating Quote Configuration', status: 'pending' },
    { id: 3, label: 'Confirming Product & Hyperforce Eligibility', status: 'pending' },
    { id: 4, label: 'Validating Order Form Terms', status: 'pending' },
  ];

  const [validationSteps, setValidationSteps] = useState(initialSteps);

  // Constants
  const quoteId = "Q-11128001";
  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  
  const expDateObj = new Date();
  expDateObj.setDate(expDateObj.getDate() + 5);
  const expirationDate = expDateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  // Data State
  const [awsAccountNumber, setAwsAccountNumber] = useState('485860572709');
  const [buyers, setBuyers] = useState([
    { id: Date.now(), name: 'Drew Mitchell', email: 'drew.mitchell@salesforce.com' }
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDocusignValidated, setIsDocusignValidated] = useState(false);
  const fileInputRef = useRef(null);

  // Derived state for validation logic
  const isValidating = validationSteps.some(s => s.status === 'loading');
  const allValidationsCompleted = validationSteps.every(s => s.status === 'success' || s.status === 'error' || s.status === 'warning');
  const hasBlockingError = validationSteps.some(s => s.status === 'error');
  const hasWarning = validationSteps.some(s => s.status === 'warning');

  const getMethodDescription = () => {
    if (deliveryMethod === 'none') {
      return "Generates a countersigned version of the Order Form and uploads directly to the AWS Marketplace for customer to accept the Private Offer. This is the quickest way to book your deal.";
    } else if (deliveryMethod === 'pdf') {
      return "Generates a PDF of the Order Form for printing or emailing for the customer to physically sign and return to Salesforce. The signed document can be uploaded to the Private Offer.";
    }
    return "";
  };

  // Automated validation simulation
  useEffect(() => {
    if (view === 'validation') {
      let isCancelled = false;
      const runValidation = async () => {
        setValidationSteps(initialSteps.map((s, i) => ({ ...s, status: i === 0 ? 'loading' : 'pending' })));

        for (let i = 0; i < initialSteps.length; i++) {
          if (isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let isBypassed = false;

          // Logic for Eligibility failures (Step 3)
          if (i === 2) {
            if (scenario === 'fail') {
              if (!marketplaceValidationsBypass) {
                setValidationSteps(prev => prev.map((step, idx) => {
                  if (idx === i) return { ...step, status: 'error', error: 'Service Cloud Voice with Amazon Connect (5,000 Minutes) is not an Eligible SKU.' };
                  return step;
                }));
                return;
              } else {
                isBypassed = true;
              }
            } else if (scenario === 'hyperforce') {
              if (!marketplaceValidationsBypass) {
                setValidationSteps(prev => prev.map((step, idx) => {
                  if (idx === i) return { ...step, status: 'error', error: 'Customer not deployed on Hyperforce and requires approval to transact through AWS Marketplace. Please reach out to your assigned Partner Sales Manager to request an exception.' };
                  return step;
                }));
                return;
              } else {
                isBypassed = true;
              }
            }
          }

          // Logic for Custom QST warning (Step 4)
          if (i === 3 && scenario === 'custom_qst') {
            if (!marketplaceCustomTermBypass) {
              setValidationSteps(prev => prev.map((step, idx) => {
                  if (idx === i) return { ...step, status: 'warning', error: 'Custom QST detected. Marketplace Ops review required.' };
                  return step;
              }));
              return;
            } else {
              isBypassed = true;
            }
          }

          setValidationSteps(prev => prev.map((step, idx) => {
            if (idx === i) return { ...step, status: 'success', isBypassed };
            if (idx === i + 1) return { ...step, status: 'loading' };
            return step;
          }));
        }
      };
      runValidation();
      return () => { isCancelled = true; };
    }
  }, [view, scenario, marketplaceValidationsBypass, marketplaceCustomTermBypass]);

  const handleNext = () => {
    if (deliveryMethod === 'pdf') setView('pdf_workflow');
    else if (deliveryMethod === 'docusign') setView('docusign_status');
  };

  const handleAWSPrivateOffer = () => {
    setOfferStatus('uploading');
    if ((scenario === 'custom_qst' && !marketplaceCustomTermBypass) || deliveryMethod === 'pdf') {
      setTrackingScenario('review');
    } else {
      setTrackingScenario('standard');
    }
    setView('private_offer_status');
  };

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (trackingScenario === 'standard') setOfferStatus('created');
      else setOfferStatus('draft');
      setStatusMessage("Status synchronized with AWS Marketplace.");
      setTimeout(() => setStatusMessage(null), 3000);
    }, 1500);
  };

  const handleCancel = () => {
    setStatusMessage("Operation cancelled.");
    setTimeout(() => {
        setStatusMessage(null);
        setView('crm_quote'); 
        setOfferStatus('uploading');
        setUploadedFile(null);
        setIsDocusignValidated(false);
        setHasCreatedOffer(false);
    }, 1500);
  };

  // Reusable Form Component
  const MarketplaceInfoForm = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">AWS Marketplace Information</h3>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>
      <div className="max-w-xs">
        <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5 tracking-wider">AWS Account Number</label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={awsAccountNumber} onChange={(e) => setAwsAccountNumber(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between"><label className="text-xs font-bold text-gray-500 uppercase block tracking-wider">Buyer Information</label><button onClick={() => setBuyers([...buyers, {id: Date.now(), name: '', email: ''}])} className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors font-semibold"><Plus className="w-3 h-3" /> Add Buyer</button></div>
        <div className="space-y-3">{buyers.map((b) => (
            <div key={b.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 border rounded-md relative group transition-all hover:border-gray-300">
              <div className="flex-1 relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={b.name} onChange={(e) => setBuyers(buyers.map(bu => bu.id === b.id ? {...bu, name: e.target.value} : bu))} className="w-full pl-10 pr-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" /></div>
              <div className="flex-1 relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" value={b.email} onChange={(e) => setBuyers(buyers.map(bu => bu.id === b.id ? {...bu, email: e.target.value} : bu))} className="w-full pl-10 pr-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email" /></div>
              {buyers.length > 1 && (<button onClick={() => setBuyers(buyers.filter(bu => bu.id !== b.id))} className="absolute -right-2 -top-2 bg-white border border-gray-200 shadow-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 hover:border-red-200"><X className="w-3 h-3" /></button>)}
            </div>
          ))}</div>
      </div>
    </div>
  );

  // --- 0. CASE INTAKE FLOW ---
  if (view === 'case_intake') {
    return <CaseIntakeFlow onBack={() => setView('validation')} initialQuoteId={quoteId} />;
  }

  // --- 1. UNPUBLISH FLOW ---
  if (view === 'unpublish') {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800 animate-in fade-in duration-300">
        <div className="max-w-5xl mx-auto bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
           
           {/* Header */}
           <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#f3f3f3]">
             <h1 className="text-gray-800 text-sm">Unpublish Quote or Create Private Offer : <span className="text-[#006dcc]">{quoteId}</span></h1>
             <button onClick={() => { setView('crm_quote'); setUploadedFile(null); setIsDocusignValidated(false); }} className="text-[#006dcc] hover:underline text-sm">Back to Quote : {quoteId}</button>
           </div>
           
           <div className="p-8">
             <p className="text-gray-800 text-[15px] mb-8">
               {hasCreatedOffer
                 ? `Are you sure you want to unpublish ${quoteId} and cancel the Private Offer?`
                 : `Are you sure you want to unpublish ${quoteId} from ${deliveryMethod === 'docusign' ? 'DocuSign' : 'Print'}?`
               }
             </p>
             
             <div className="flex justify-start gap-3">
               <button onClick={() => {
                 setQuoteStatus('Approved');
                 setView('crm_quote');
                 setUploadedFile(null);
                 setIsDocusignValidated(false);
                 setDeliveryMethod('none');
                 setHasCreatedOffer(false);
               }} className="px-4 py-1.5 border border-[#006dcc] text-[#006dcc] rounded text-[13px] hover:bg-blue-50 transition-colors bg-white">Unpublish</button>
               
               <button onClick={() => {
                 setView('crm_quote');
                 setUploadedFile(null);
                 setIsDocusignValidated(false);
               }} className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded text-[13px] hover:bg-gray-50 transition-colors bg-white">Cancel</button>
             </div>

             {!hasCreatedOffer && deliveryMethod === 'docusign' && !isDocusignValidated && (
               <div className="mt-10 pt-8 border-t border-gray-200 animate-in fade-in">
                 <p className="text-gray-800 text-[15px] mb-8">
                   Click to validate Docusign envelope to proceed with Private Offer creation.
                 </p>
                 <div className="flex gap-3">
                   <button onClick={() => setIsDocusignValidated(true)} className="px-4 py-1.5 border border-[#006dcc] text-[#006dcc] rounded text-[13px] hover:bg-blue-50 transition-colors bg-white">
                     Validate Docusign Envelope
                   </button>
                   <button onClick={() => { setView('crm_quote'); setUploadedFile(null); setIsDocusignValidated(false); }} className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded text-[13px] hover:bg-gray-50 transition-colors bg-white">
                     Cancel
                   </button>
                 </div>
               </div>
             )}

             {!hasCreatedOffer && deliveryMethod !== 'docusign' && !uploadedFile && (
               <div className="mt-10 pt-8 border-t border-gray-200 animate-in fade-in">
                 <p className="text-gray-800 text-[15px] mb-8">
                   Once signed documents have been received, click here to upload and proceed with Private Offer creation.
                 </p>
                 <div className="flex gap-3">
                   <button onClick={() => fileInputRef.current.click()} className="px-4 py-1.5 border border-[#006dcc] text-[#006dcc] rounded text-[13px] hover:bg-blue-50 transition-colors bg-white">
                     Upload Signed PDF
                   </button>
                   <button onClick={() => { setView('crm_quote'); setUploadedFile(null); setIsDocusignValidated(false); }} className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded text-[13px] hover:bg-gray-50 transition-colors bg-white">
                     Cancel
                   </button>
                 </div>
               </div>
             )}

             <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => { const f = e.target.files[0]; if(f) setUploadedFile(f); }} />

             {(uploadedFile || isDocusignValidated) && !hasCreatedOffer && (
                <div className="mt-10 pt-8 border-t border-gray-200 animate-in fade-in">
                  {uploadedFile && (
                    <div className="p-4 rounded-md border border-green-200 bg-green-50 flex items-center justify-between mb-8 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><FileText className="w-5 h-5" /></div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800 block truncate max-w-[250px]">{uploadedFile.name}</span>
                            <span className="text-[10px] text-green-700 font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Ready for Marketplace</span>
                          </div>
                        </div>
                        <button onClick={() => setUploadedFile(null)} className="p-2 hover:bg-green-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  )}

                  {isDocusignValidated && (
                    <div className="p-4 rounded-md border border-green-200 bg-green-50 flex items-center justify-between mb-8 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><CheckCircle2 className="w-5 h-5" /></div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800 block truncate max-w-[250px]">DocuSign Envelope Validated</span>
                            <span className="text-[10px] text-green-700 font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Ready for Marketplace</span>
                          </div>
                        </div>
                        <button onClick={() => setIsDocusignValidated(false)} className="p-2 hover:bg-green-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  )}
                  
                  <MarketplaceInfoForm />
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                      <button onClick={handleAWSPrivateOffer} className="px-8 py-2.5 bg-blue-600 text-white rounded shadow-md text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                          <Cloud className="w-4 h-4" /> Create AWS Private Offer
                      </button>
                  </div>
                </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  // --- 2. CRM VIEW ---
  if (view === 'crm_quote') {
    return (
      <div className="min-h-screen bg-[#f3f3f3] font-sans text-gray-800 animate-in fade-in duration-300">
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-[#5ea4de] p-1.5 rounded"><FileText className="w-5 h-5 text-white" /></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-bold leading-tight">Quote (CPQ)</p><h1 className="text-xl font-bold leading-tight">{quoteId}</h1></div>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">+ Follow</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">New Note</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Video</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">New Travel Approval</button>
                <button className="px-2 py-1.5 border border-gray-300 rounded hover:bg-gray-50"><ChevronDown className="w-4 h-4" /></button>
            </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-12 text-sm">
            <div><p className="text-xs text-gray-500">Quote Status</p><p className="font-semibold">{quoteStatus}</p></div>
            <div><p className="text-xs text-gray-500">Primary</p><CheckCircle2 className="w-4 h-4 text-green-600 mt-1" /></div>
            <div><p className="text-xs text-gray-500">Total Quote Amount</p><p className="font-semibold">USD 2,100.00</p></div>
        </div>

        <div className="px-4 py-3 bg-[#e8f0f8] border-b border-gray-200">
            <div className="flex items-center gap-1 mb-2"><h3 className="text-sm font-bold">Related List Quick Links</h3><Info className="w-3.5 h-3.5 text-gray-400" /></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#0176d3] font-medium">
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><Plus className="w-3 h-3" /> Marketplace Offers (3)</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><Plus className="w-3 h-3" /> Configuration Approval Requests (1)</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><Plus className="w-3 h-3" /> Pricing Agreements (0)</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><Plus className="w-3 h-3" /> Quotes Lines (1)</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><Plus className="w-3 h-3" /> Special Terms (4)</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline">Show All (22)</span>
            </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
                <div className="flex border-b border-gray-200 gap-8 px-2">
                    <button className="pb-2 text-sm font-bold border-b-2 border-transparent">Related</button>
                    <button className="pb-2 text-sm font-bold border-b-2 border-blue-600 text-blue-600">Details</button>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2"><ChevronDown className="w-4 h-4 text-gray-500" /><span className="text-sm font-bold uppercase tracking-wider text-gray-600">Actions</span></div>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2">
                        {["Edit", "Sharing", "Submit/Review Approvals", "Approve/Reject"].map(btn => (<button key={btn} className="px-3 py-1 border border-gray-300 rounded bg-white text-xs font-medium hover:bg-gray-50 transition-colors">{btn}</button>))}
                        <button 
                            onClick={() => { 
                              if (quoteStatus === 'Published') {
                                setView('unpublish');
                              } else {
                                setQuoteStatus('Approved'); 
                                setView('validation'); 
                              }
                            }} 
                            className="px-3 py-1 border border-blue-400 bg-blue-50 text-blue-700 rounded text-xs font-bold hover:bg-blue-100 transition-all shadow-sm ring-1 ring-blue-200"
                        >
                            Publish/Unpublish
                        </button>
                        {["Configure", "Legal View", "Quote to Oppty Sync", "Toggle SFDC Signature", "Clone", "Re-trigger Tax Estimation"].map(btn => (<button key={btn} className="px-3 py-1 border border-gray-300 rounded bg-white text-xs font-medium hover:bg-gray-50 transition-colors">{btn}</button>))}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div className="border-b border-gray-200 pb-2 flex flex-col justify-between">
                            <label className="text-[13px] font-bold text-gray-800 block mb-3">Marketplace Validations Bypass</label>
                            <input 
                                type="checkbox" 
                                checked={marketplaceValidationsBypass} 
                                onChange={(e) => setMarketplaceValidationsBypass(e.target.checked)} 
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                            />
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                            <label className="text-[13px] font-bold text-gray-800 block mb-3">Reason for Bypass</label>
                            <input 
                                type="text" 
                                value={marketplaceValidationsBypassReason}
                                onChange={(e) => setMarketplaceValidationsBypassReason(e.target.value)}
                                disabled={!marketplaceValidationsBypass}
                                className="w-full border-none bg-transparent focus:ring-0 text-[13px] text-gray-900 placeholder-gray-400 p-0 outline-none disabled:opacity-50"
                                placeholder={marketplaceValidationsBypass ? "Enter reason..." : ""}
                            />
                        </div>
                        <div className="border-b border-gray-200 pb-2 flex flex-col justify-between">
                            <label className="text-[13px] font-bold text-gray-800 block mb-3">Marketplace Custom Term Bypass</label>
                            <input 
                                type="checkbox" 
                                checked={marketplaceCustomTermBypass} 
                                onChange={(e) => setMarketplaceCustomTermBypass(e.target.checked)} 
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                            />
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                            <label className="text-[13px] font-bold text-gray-800 block mb-3">Reason for Bypass</label>
                            <input 
                                type="text" 
                                value={marketplaceCustomTermBypassReason}
                                onChange={(e) => setMarketplaceCustomTermBypassReason(e.target.value)}
                                disabled={!marketplaceCustomTermBypass}
                                className="w-full border-none bg-transparent focus:ring-0 text-[13px] text-gray-900 placeholder-gray-400 p-0 outline-none disabled:opacity-50"
                                placeholder={marketplaceCustomTermBypass ? "Enter reason..." : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Server className="w-5 h-5 text-green-600" /><h4 className="font-bold text-sm">Address Validation Status</h4></div><span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Validated</span></div>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm">
                    <div className="flex border-b border-gray-200 text-xs font-bold"><button className="flex-1 py-3 text-blue-600 border-b-2 border-blue-600">Activity</button><button className="flex-1 py-3 text-gray-500 hover:text-gray-700">Chatter</button></div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between border border-gray-200 p-2 rounded"><span className="text-xs text-gray-500">Only show activities with insights</span><div className="w-8 h-4 bg-gray-200 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div></div>
                        <div className="text-center py-8 text-sm text-gray-400">No activities to show.</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="fixed bottom-4 left-4 z-50">
            <button className="bg-[#0176d3] text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-xl hover:bg-[#0165b5] transition-all"><Menu className="w-4 h-4" /><span className="font-bold text-sm">Sales Support</span><span className="text-lg">🐻</span></button>
        </div>
      </div>
    );
  }

  // --- 3. VALIDATION CHECKLIST ---
  if (view === 'validation') {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center font-sans text-gray-800 animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-white border border-gray-300 rounded shadow-lg p-8 animate-in zoom-in duration-300 relative">
          <div className="absolute top-4 right-4 group">
            <button className="p-2 text-gray-300 hover:text-blue-500 transition-colors"><Settings className="w-4 h-4" /></button>
            <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-xl rounded p-2 hidden group-hover:block z-50 min-w-[200px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Demo Scenarios</p>
                <button onClick={() => setScenario('success')} className={`w-full text-left px-3 py-1.5 text-xs rounded mb-1 ${scenario === 'success' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>All Checks Passed</button>
                <button onClick={() => setScenario('fail')} className={`w-full text-left px-3 py-1.5 text-xs rounded mb-1 ${scenario === 'fail' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50'}`}>Ineligible SKU Found</button>
                <button onClick={() => setScenario('hyperforce')} className={`w-full text-left px-3 py-1.5 text-xs rounded mb-1 ${scenario === 'hyperforce' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50'}`}>Hyperforce Approval Needed</button>
                <button onClick={() => setScenario('custom_qst')} className={`w-full text-left px-3 py-1.5 text-xs rounded ${scenario === 'custom_qst' ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-gray-50'}`}>Custom QST</button>
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4"><span className="text-3xl">🦆</span></div>
            <h1 className="text-xl font-bold text-gray-800">AWS Marketplace QUICK Checklist</h1>
            <p className="text-sm text-gray-500 mt-1">Running automated quote checks...</p>
          </div>
          <div className="space-y-3 mb-10">
            {validationSteps.map((step) => (
              <div key={step.id} className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    step.status === 'error' ? 'border-red-200 bg-red-50' : 
                    step.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                    (step.status === 'success' && step.isBypassed) ? 'border-blue-200 bg-blue-50/50' :
                    step.status === 'success' ? 'border-gray-100 bg-gray-50/50' : 'border-gray-100 bg-transparent'
                }`}>
                    <span className={`text-sm flex items-center ${
                        (step.status === 'success' && step.isBypassed) ? 'text-blue-700 font-medium' :
                        step.status === 'success' ? 'text-gray-700' : 
                        step.status === 'error' ? 'text-red-700 font-medium' : 
                        step.status === 'warning' ? 'text-amber-700 font-medium' : 'text-gray-400'
                    }`}>
                        {step.label}
                        {step.isBypassed && <span className="ml-2 text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded tracking-wider">Bypassed</span>}
                    </span>
                    <div>
                        {step.status === 'loading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                        {step.status === 'success' && !step.isBypassed && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                        {step.status === 'success' && step.isBypassed && <ShieldCheck className="w-5 h-5 text-blue-500 animate-in zoom-in" />}
                        {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500 animate-bounce" />}
                        {step.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 animate-in zoom-in" />}
                        {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                    </div>
                </div>
                {step.error && (step.status === 'error' || step.status === 'warning') && (
                    <div className={`px-3 py-2 text-[11px] border-l-2 rounded-r animate-in slide-in-from-top-1 leading-relaxed ${
                        step.status === 'error' ? 'text-red-600 bg-red-100/50 border-red-500' : 'text-amber-600 bg-amber-100/50 border-amber-500'
                    }`}>
                        {step.error}
                    </div>
                )}
              </div>
            ))}
          </div>
          
          {hasBlockingError ? (
            <div className="space-y-3">
               <button onClick={() => { setView('crm_quote'); }} className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">Return to Quote Configuration</button>
               <button onClick={() => setView('case_intake')} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"><LifeBuoy className="w-4 h-4" /> Log a Marketplace Operations Case</button>
               <button onClick={handleCancel} className="w-full text-xs text-gray-400 hover:text-gray-600 underline text-center block">Exit to Quote</button>
            </div>
          ) : hasWarning ? (
            <div className="space-y-3">
               <button 
                  disabled={!allValidationsCompleted && isValidating} 
                  onClick={() => setView('publication')} 
                  className={`w-full py-3 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 
                  ${allValidationsCompleted && !isValidating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
               >
                  {allValidationsCompleted ? 'Continue to Publish Options' : 'Validating...'}
               </button>
               <button onClick={() => setView('case_intake')} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"><LifeBuoy className="w-4 h-4" /> Log a Marketplace Operations Case</button>
               <button onClick={handleCancel} className="w-full text-xs text-gray-400 hover:text-gray-600 underline text-center block">Exit to Quote</button>
            </div>
          ) : (
            <button 
                disabled={!allValidationsCompleted && isValidating} 
                onClick={() => setView('publication')} 
                className={`w-full py-3 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 
                ${allValidationsCompleted && !isValidating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
                {allValidationsCompleted ? 'Continue to Publish Options' : 'Validating...'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- 4. PRIVATE OFFER STATUS ---
  if (view === 'private_offer_status') {
    const isCreated = offerStatus === 'created';
    const isDraft = offerStatus === 'draft';
    const isComplete = isCreated || isDraft;
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden relative">
          <div className="absolute top-4 right-4 group">
            <button className="p-2 text-gray-300 hover:text-blue-500 transition-colors"><Settings className="w-4 h-4" /></button>
            <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-xl rounded p-2 hidden group-hover:block z-50 min-w-[220px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Tracking Scenarios</p>
                <button onClick={() => setTrackingScenario('standard')} className={`w-full text-left px-3 py-1.5 text-xs rounded mb-1 ${trackingScenario === 'standard' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>Standard Private Offer</button>
                <button onClick={() => setTrackingScenario('review')} className={`w-full text-left px-3 py-1.5 text-xs rounded ${trackingScenario === 'review' ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-gray-50'}`}>Marketplace Ops Review Required</button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <h1 className="text-blue-700 font-normal">Private Offer Tracking : <span className="hover:underline cursor-pointer">{quoteId}</span></h1>
            {!isComplete && <button onClick={() => setView('publication')} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back to Publication</button>}
          </div>

          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              
              {/* Status Banner */}
              <div className={`flex items-center gap-6 mb-8 p-6 border rounded-lg transition-all duration-500 ${isCreated ? 'bg-green-50 border-green-100' : isDraft ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className={`p-4 bg-white rounded-full shadow-sm transition-colors ${isCreated ? 'text-green-600' : isDraft ? 'text-amber-600' : 'text-blue-600 animate-pulse'}`}>
                  {isCreated ? <CheckCircle2 className="w-8 h-8" /> : isDraft ? <AlertTriangle className="w-8 h-8" /> : <Cloud className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isCreated ? 'text-green-900' : isDraft ? 'text-amber-900' : 'text-blue-900'}`}>
                    {isCreated ? 'Private Offer Created Successfully' : isDraft ? 'Private Offer Ready for Review' : 'Private Offer Sent Successfully'}
                  </h2>
                  <p className={`text-sm mt-1 flex items-center gap-1.5 ${isCreated ? 'text-green-700' : isDraft ? 'text-amber-700' : 'text-blue-700'}`}>
                    <Clock className="w-4 h-4" /> {isCreated ? `Active as of ${today}` : isDraft ? 'Awaiting Operations Review' : `Sent on ${today}`}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Offer Details</h3>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Account</p>
                    <p className="text-sm font-medium p-2 bg-gray-50 border border-gray-200 rounded font-mono">{awsAccountNumber}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submission Date</p>
                    <p className="text-sm font-medium p-2 bg-gray-50 border border-gray-200 rounded">{today}</p>
                  </div>

                  {isCreated && (
                    <>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offer ID</p>
                        <p className="text-sm font-bold p-2 bg-green-50 border border-green-200 text-green-800 rounded font-mono">Offer-abc123def1234</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offer Expiration</p>
                        <p className="text-sm font-medium p-2 bg-gray-50 border border-gray-200 rounded">{expirationDate}</p>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offer URL</p>
                        <p className="text-sm font-medium p-2 bg-gray-50 border border-gray-200 rounded truncate">
                          <a href="https://aws.amazon.com/marketplace/procurement/?productId=prod-ohdccx5x3yp2e&offerId=offer-abc123def1234" target="_blank" rel="noreferrer" className="text-[#006dcc] hover:underline">
                            https://aws.amazon.com/marketplace/procurement/?productId=prod-ohdccx5x3yp2e&offerId=offer-abc123def1234
                          </a>
                        </p>
                      </div>
                    </>
                  )}

                  {isDraft && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Case Reference</p>
                      <p className="text-sm font-bold p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded">
                         <a href="#" className="underline hover:text-amber-900" onClick={(e) => { e.preventDefault(); setView('case_intake'); }}>8028493</a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buyer Info */}
              {isCreated && (
                <div className="space-y-6 mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Buyer Information</h3>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    {buyers.map(b => (
                      <div key={b.id} className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">{b.name}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{b.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing States */}
              {!isComplete ? (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-8">
                   <div className="flex items-center gap-3">
                      <Loader2 className={`w-5 h-5 text-blue-500 ${!isRefreshing ? 'animate-spin' : ''}`} />
                      <p className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                         Processing: Uploading to Marketplace...
                      </p>
                   </div>
                   <div className="w-full bg-blue-200 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                   </div>
                </div>
              ) : isDraft ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start gap-3 mt-8">
                   <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                   <p className="text-sm text-amber-800 leading-relaxed">
                      The Private Offer has been created and is in Draft status awaiting review. A Marketplace Operations Case (<a href="#" className="font-bold underline hover:text-amber-900" onClick={(e) => { e.preventDefault(); setView('case_intake'); }}>8028493</a>) has been created on your behalf. You will receive an update once the Private Offer has been sent or if there are issues.
                   </p>
                </div>
              ) : null}

              {/* Buttons */}
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-4">
                <button onClick={handleRefreshStatus} disabled={isRefreshing || isComplete} className={`px-8 py-2.5 rounded shadow-sm text-sm font-bold flex items-center gap-2 border transition-all ${(isRefreshing || isComplete) ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}><RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />{isComplete ? 'Up to Date' : 'Refresh Status'}</button>
                <button onClick={() => {
                    if (isComplete) {
                        setQuoteStatus('Published');
                        setHasCreatedOffer(true);
                        setView('crm_quote');
                    } else {
                        handleCancel();
                    }
                }} className={`px-8 py-2.5 rounded shadow-md text-sm font-bold transition-all flex items-center gap-2 ${isCreated ? 'bg-green-600 hover:bg-green-700' : isDraft ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                    {isComplete ? 'Finish & Return to Quote' : 'Finish & Exit'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. DOCUSIGN TRACKING ---
  if (view === 'docusign_status') {
    const isReceived = docusignScenario === 'received';
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden relative">
          <div className="absolute top-4 right-4 group">
            <button className="p-2 text-gray-300 hover:text-blue-500 transition-colors"><Settings className="w-4 h-4" /></button>
            <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-xl rounded p-2 hidden group-hover:block z-50 min-w-[220px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">DocuSign Scenarios</p>
                <button onClick={() => setDocusignScenario('awaiting')} className={`w-full text-left px-3 py-1.5 text-xs rounded mb-1 ${docusignScenario === 'awaiting' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}>Awaiting External Signature</button>
                <button onClick={() => setDocusignScenario('received')} className={`w-full text-left px-3 py-1.5 text-xs rounded ${docusignScenario === 'received' ? 'bg-green-50 text-green-700 font-bold' : 'hover:bg-gray-50'}`}>External Signature Received</button>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <h1 className="text-blue-700 font-normal">DocuSign Tracking : <span className="hover:underline cursor-pointer">{quoteId}</span></h1>
            <button onClick={() => setView('publication')} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Edit Publication Settings</button>
          </div>
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className={`flex items-center gap-6 mb-8 p-6 border rounded-lg transition-all duration-500 ${isReceived ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className={`p-4 bg-white rounded-full shadow-sm transition-colors ${isReceived ? 'text-green-600' : 'text-blue-600 animate-pulse'}`}>{isReceived ? <CheckCircle2 className="w-8 h-8" /> : <Send className="w-8 h-8" />}</div>
                <div><h2 className={`text-lg font-bold ${isReceived ? 'text-green-900' : 'text-blue-900'}`}>DocuSign Status: {isReceived ? 'Signed Envelope Received' : 'Sent for Signature'}</h2><p className={`text-sm mt-1 flex items-center gap-1.5 ${isReceived ? 'text-green-700' : 'text-blue-700'}`}><Clock className="w-4 h-4" /> {isReceived ? 'Received' : 'Sent'} on {today}</p></div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Email</p><p className="text-sm font-medium p-2 bg-gray-50 border border-gray-200 rounded">{docusignEmail}</p></div>
                  <div className="space-y-1.5"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workflow Step</p><p className={`text-sm font-bold p-2 border rounded transition-colors ${isReceived ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200'}`}>{isReceived ? 'External Signature Received' : 'Awaiting External Signature'}</p></div>
                </div>
                {!isReceived ? <div className="bg-amber-50 border border-amber-200 p-4 rounded-md animate-in fade-in duration-300"><div className="flex gap-3"><AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" /><p className="text-xs text-amber-800 leading-relaxed">The Create AWS Private Offer workflow is locked until the Order Form has been fully executed via DocuSign.</p></div></div> : <div className="mt-8 pt-8 border-t border-gray-100"><MarketplaceInfoForm /></div>}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-4">
                <button onClick={handleAWSPrivateOffer} disabled={!isReceived} className={`px-8 py-2.5 border rounded shadow-sm text-sm font-bold flex items-center gap-2 transition-all ${!isReceived ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 cursor-pointer shadow-md'}`}><Cloud className={`w-4 h-4 ${!isReceived ? 'text-gray-400' : 'text-blue-500'}`} /> Create AWS Private Offer</button>
                <button onClick={handleCancel} className="px-8 py-2.5 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 6. PDF WORKFLOW (SCREENSHOT-BASED VIEWER) ---
  if (view === 'pdf_workflow') {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800 animate-in fade-in duration-500 flex items-center justify-center">
        <div className="max-w-5xl w-full bg-white border border-gray-300 shadow-xl overflow-hidden flex flex-col h-[85vh]">
          
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h1 className="text-sm font-bold text-gray-800">Publish Quote : <span className="text-blue-600 font-normal hover:underline cursor-pointer">{quoteId}</span></h1>
            <button onClick={() => setView('crm_quote')} className="text-blue-600 text-sm hover:underline">Back to Quote : {quoteId}</button>
          </div>

          <div className="px-6 py-4 bg-white flex flex-col space-y-3">
             <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest">PDF Created</h2>
             <div className="flex items-center gap-6 text-sm text-gray-800">
                <label className="flex items-center gap-2 opacity-50 cursor-not-allowed"><div className="w-3.5 h-3.5 rounded-full border border-gray-400"></div> e-sign with Docusign</label>
                <label className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-4 border-blue-600 flex items-center justify-center"></div> PDF Creation</label>
             </div>
             <p className="text-sm text-gray-700">The quote status has been updated and Quote Legal View has been generated below for print.</p>
             <div className="pt-2">
               <button 
                  onClick={() => { 
                    setQuoteStatus('Published'); 
                    setView('crm_quote'); 
                  }} 
                  className="px-6 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 bg-white shadow-sm font-medium text-gray-700 transition-colors"
                >
                  Close
               </button>
             </div>
          </div>

          <div className="flex-1 bg-[#323639] flex flex-col overflow-hidden mx-4 mb-4 border border-gray-700 rounded-sm">
             <div className="bg-[#323639] text-white px-4 py-2 flex items-center justify-between border-b border-gray-700 text-sm select-none">
                <div className="flex items-center gap-4"><Menu className="w-5 h-5 cursor-pointer hover:text-gray-300" /><span className="font-semibold text-xs tracking-wider">SfdcQuoteLegalViewPage</span></div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 bg-[#202124] px-3 py-1 rounded"><span className="font-medium">1</span> <span className="text-gray-400">/ 6</span></div>
                   <div className="w-px h-5 bg-gray-600"></div>
                   <div className="flex items-center gap-3"><Minus className="w-4 h-4 cursor-pointer hover:text-gray-300" /><span className="font-medium w-8 text-center">90%</span><Plus className="w-4 h-4 cursor-pointer hover:text-gray-300" /></div>
                   <div className="w-px h-5 bg-gray-600"></div>
                   <div className="flex items-center gap-3"><FileText className="w-4 h-4 cursor-pointer hover:text-gray-300" /><RotateCw className="w-4 h-4 cursor-pointer hover:text-gray-300" /></div>
                </div>
                <div className="flex items-center gap-4 text-gray-300"><Cloud className="w-5 h-5 cursor-pointer hover:text-white" /><Download className="w-5 h-5 cursor-pointer hover:text-white" /><Printer className="w-5 h-5 cursor-pointer hover:text-white" /><MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" /></div>
             </div>

             <div className="flex flex-1 overflow-hidden relative">
                <div className="w-56 bg-[#323639] border-r border-gray-700 overflow-y-auto p-4 space-y-6 hidden md:block">
                    {[1,2,3].map(i => (
                       <div key={i} className="flex flex-col items-center gap-2">
                          <div className={`w-36 h-48 bg-white ${i===1 ? 'border-[3px] border-blue-400 shadow-[0_0_0_2px_rgba(96,165,250,0.5)]' : 'opacity-80 hover:opacity-100 cursor-pointer'} flex items-center justify-center p-2`}>
                              <div className="w-full h-full border border-gray-100 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ccc_2px,#ccc_3px)]"></div>
                          </div>
                          <span className="text-xs text-white font-medium">{i}</span>
                       </div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#525659]">
                    <div className="bg-white w-full max-w-2xl min-h-[850px] shadow-2xl p-12 text-gray-800 font-serif relative">
                        <div className="flex justify-between items-start mb-12 border-b-2 border-gray-800 pb-8">
                            <div className="flex items-center gap-2 text-[#00a1e0] font-bold text-3xl"><Cloud className="w-10 h-10 fill-current" /> salesforce</div>
                            <div className="text-[10px] text-gray-600 leading-relaxed">Salesforce, Inc.<br/>Salesforce Tower<br/>415 Mission Street, 3rd Floor<br/>San Francisco, CA 94105<br/>United States</div>
                            <div className="text-[10px] text-right text-gray-600 leading-relaxed">ORDER FORM for Drew AWS UAT 10.1<br/>Offer Valid Through: 2/28/2026<br/>Proposed by: Sally Sales<br/>Quote Number: {quoteId}</div>
                        </div>
                        <h2 className="text-xl tracking-widest mb-8 font-bold">ORDER FORM</h2>
                        <h3 className="text-lg border-b border-gray-300 pb-2 mb-4 font-semibold">Address Information</h3>
                        <div className="flex justify-between text-[11px] mb-10 leading-relaxed">
                            <div><p className="font-bold mb-1">Bill To:</p><p>307 W 5th St<br/>Austin<br/>TX, 78701<br/>US - United States</p><br/><p>Billing Company Name: Drew AWS UAT 10.1</p><p>Billing Contact Name: Drew Mitchell</p><p>Billing Email Address: drew.mitchell@salesforce.com</p></div>
                            <div><p className="font-bold mb-1">Ship To:</p><p>307 W 5th St<br/>Austin<br/>TX, 78701<br/>US - United States</p><br/><p>Billing Phone: (765) 432-9627</p><p>Billing Fax:</p><p>Billing Language: English</p></div>
                        </div>
                        <h3 className="text-lg border-b border-gray-300 pb-2 mb-4 font-semibold mt-12">Terms and Conditions</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[11px]">
                            <div>Contract Start Date*: 3/2/2026</div><div>Payment Method: Wire Transfer</div><div>Contract End Date*: 3/1/2028</div><div>Billing Method: </div><div>Billing Frequency: Quarterly</div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 7. PUBLICATION SETTINGS (FALLBACK) ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-blue-700 font-normal">Publish Quote : <span className="hover:underline cursor-pointer">{quoteId}</span></h1>
          <div className="flex items-center gap-4"><span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase bg-green-50 px-2 py-0.5 rounded border border-green-200"><ShieldCheck className="w-3 h-3" /> Validated</span>
            <button onClick={handleCancel} className="text-blue-600 hover:underline text-sm transition-colors">Back to Quote</button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <h3 className="uppercase text-xs font-semibold tracking-wider text-gray-500 mb-4">Choose a delivery method for this quote:</h3>
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" checked={deliveryMethod === 'none'} onChange={() => setDeliveryMethod('none')} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="group-hover:text-blue-600">Signature not required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" checked={deliveryMethod === 'docusign'} onChange={() => setDeliveryMethod('docusign')} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="group-hover:text-blue-600">e-sign with Docusign</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" checked={deliveryMethod === 'pdf'} onChange={() => setDeliveryMethod('pdf')} className="w-4 h-4 text-blue-600 border-gray-300" />
                <span className="group-hover:text-blue-600">PDF Creation</span>
              </label>
            </div>
            
            {deliveryMethod !== 'docusign' && <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-4 py-1">{getMethodDescription()}</p>}
          </section>
          
          <div className="min-h-[140px]">
            {deliveryMethod === 'pdf' && (
              <section className="animate-in fade-in slide-in-from-top-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <h3 className="text-sm text-gray-600 md:w-1/3 font-medium">Number of signature blocks to generate:</h3>
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex items-center gap-3 cursor-pointer group"><input type="radio" checked={signatureBlocks === num} onChange={() => setSignatureBlocks(num)} className="w-4 h-4 text-blue-600" /><span className="text-sm group-hover:text-blue-600">{num}</span></label>
                    ))}
                  </div>
                </div>
              </section>
            )}
            
            {deliveryMethod === 'none' && (
              <section className="animate-in fade-in slide-in-from-top-1"><MarketplaceInfoForm /></section>
            )}
            
            {deliveryMethod === 'docusign' && (
              <section className="animate-in fade-in slide-in-from-top-1 space-y-8">
                 <p className="text-[13px] text-gray-700 leading-relaxed max-w-4xl">Publishes the quote via Docusign for e-signature, or customer can print directly from Docusign if they require ink signature. You can choose to email a Docusign envelope to up to 5 contacts for signature (choose Add Signer for additional contacts), or you can have a single contact sign in person on your own device (check the "In person signing" field). Customer will still be required to accept a Private Offer in the Marketplace after signing.</p>
                 <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Select Recipient(s)</h4>
                    <div className="max-w-2xl space-y-4">
                       <div className="flex items-center">
                          <label className="w-1/4 text-[13px] text-gray-700 font-medium"><span className="text-[#d13212] font-bold mr-1">*</span> From</label>
                          <div className="w-3/4 relative">
                            <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" />
                            <input type="text" value={docusignForm.from} onChange={(e) => setDocusignForm({...docusignForm, from: e.target.value})} className="w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-blue-500" />
                            <div className="absolute right-2.5 top-2.5 bg-gray-300 rounded-full p-0.5 cursor-pointer hover:bg-gray-400"><X className="w-3 h-3 text-white" /></div>
                          </div>
                       </div>
                       <div className="flex items-center">
                          <label className="w-1/4 text-[13px] text-gray-700 font-medium"><span className="text-[#d13212] font-bold mr-1">*</span> Signer1</label>
                          <div className="w-3/4 relative">
                            <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" />
                            <input type="text" value={docusignForm.signer1} onChange={(e) => setDocusignForm({...docusignForm, signer1: e.target.value})} className="w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-blue-500" />
                            <div className="absolute right-2.5 top-2.5 bg-gray-300 rounded-full p-0.5 cursor-pointer hover:bg-gray-400"><X className="w-3 h-3 text-white" /></div>
                          </div>
                       </div>
                       <div className="flex items-center">
                          <div className="w-1/4"></div>
                          <div className="w-3/4 flex gap-4 text-[13px] text-[#006dcc] font-medium"><button className="hover:underline">Add Signer</button><button className="text-gray-600 hover:underline">Remove Signer</button></div>
                       </div>
                       <div className="flex items-start mt-2">
                         <label className="w-1/4 text-[13px] text-gray-700 mt-2 font-medium">CC:</label>
                         <div className="w-3/4">
                            <textarea rows="2" placeholder="Provide email addresses separated by comma" value={docusignForm.cc} onChange={(e) => setDocusignForm({...docusignForm, cc: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                              <input type="checkbox" checked={docusignForm.inPerson} onChange={(e) => setDocusignForm({...docusignForm, inPerson: e.target.checked})} className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300" />
                              <span className="text-[13px] text-gray-700">In person signing?</span>
                            </label>
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-gray-200">
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Review Email</h4>
                   <div className="max-w-2xl space-y-4">
                     <div className="flex items-center">
                        <label className="w-1/4 text-[13px] text-gray-700 font-medium"><span className="text-[#d13212] font-bold mr-1">*</span> Subject:</label>
                        <div className="w-3/4"><input type="text" value={docusignForm.subject} onChange={(e) => setDocusignForm({...docusignForm, subject: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-blue-500" /></div>
                     </div>
                     <div className="flex items-start">
                        <label className="w-1/4 text-[13px] text-gray-700 font-medium mt-2"><span className="text-[#d13212] font-bold mr-1">*</span> Message:</label>
                        <div className="w-3/4">
                          <textarea rows="7" value={docusignForm.message} onChange={(e) => setDocusignForm({...docusignForm, message: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-blue-500 resize-none leading-relaxed"></textarea>
                          <div className="flex gap-2 mt-4">
                             <button onClick={() => { setQuoteStatus('Published'); setView('crm_quote'); }} className="px-4 py-1.5 bg-white border border-[#006dcc] text-[#006dcc] rounded text-[13px] font-medium hover:bg-blue-50 transition-colors">Send</button>
                             <button onClick={handleCancel} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-[13px] font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                          </div>
                        </div>
                     </div>
                   </div>
                 </div>
              </section>
            )}
          </div>
          
          {deliveryMethod !== 'docusign' && (
            <div className="flex flex-wrap justify-start gap-3 pt-6 border-t border-gray-100">
              {deliveryMethod === 'none' && (<button onClick={handleAWSPrivateOffer} className="px-8 py-1.5 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold flex items-center gap-2 transition-all shadow-md active:shadow-inner"><Cloud className="w-4 h-4 text-blue-500" />Create AWS Private Offer</button>)}
              {deliveryMethod === 'pdf' && (<button onClick={handleNext} className="px-8 py-1.5 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium min-w-[100px] transition-all">Next</button>)}
              <button onClick={handleCancel} className="px-8 py-1.5 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium min-w-[100px] transition-all">Cancel</button>
            </div>
          )}
          
          {statusMessage && (<div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-xl text-sm z-50 transition-all border border-gray-700 animate-in slide-in-from-bottom-2">{statusMessage}</div>)}
        </div>
      </div>
    </div>
  );
}