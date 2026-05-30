"use client";

import { useState, useEffect } from 'react';

// Define the available fields as a type for strict checking
export type FormField = 
  | 'f_name' | 'l_name' | 'email' | 'phone' | 'city' 
  | 'region' | 'country' | 'dob' | 'total_guests' 
  | 'description' | 'company_name';

interface LeadFormProps {
  formType: string;         // e.g., 'Newsletter', 'Booking_Page'
  fields: FormField[];      // The fields you want to display
  buttonText?: string;      // Customize the button text
}

export default function LeadForm({ formType, fields, buttonText = "Subscribe" }: LeadFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    f_name: '', l_name: '', email: '', phone: '', city: '',
    region: '', country: '', dob: '', total_guests: '',
    description: '', company_name: ''
  });
  
  const [citySelection, setCitySelection] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [countryCode, setCountryCode] = useState('+61'); // NEW: Country code state
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  // Capture the URL on the client side to track the lead source
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    // Resolve the final city value
    const finalCity = citySelection === 'Other' ? customCity : citySelection;

    // Combine country code and phone number into a single string
    const finalPhone = `${countryCode}${formData.phone}`;

    const payload = {
      ...formData,
      phone: finalPhone, // Overwrite the raw phone value with the concatenated string
      form_type: formType,
      city: finalCity,
      source_url: currentUrl // Passing the captured URL to the backend
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      setFormStatus('success');
      // Optional: Clear form data here
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  // Shared input styling based on your design
  const inputClass = "w-full bg-transparent text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none";
  const wrapperClass = "border-b border-brand-black pb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 md:gap-8">
      {formStatus === 'error' && (
        <div className="text-red-500 text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-widest">
          An error occurred. Please try again.
        </div>
      )}
      
      {formStatus === 'success' && (
        <div className="text-green-500 text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-widest">
          Successfully submitted!
        </div>
      )}

      {/* Dynamically render fields based on the 'fields' prop */}
      {fields.map((field) => {
        switch (field) {
          case 'f_name':
            return (
              <div key={field} className={wrapperClass}>
                <input type="text" name="f_name" placeholder="FIRST NAME *" value={formData.f_name} onChange={handleChange} required className={inputClass} />
              </div>
            );
          case 'l_name':
            return (
              <div key={field} className={wrapperClass}>
                <input type="text" name="l_name" placeholder="LAST NAME" value={formData.l_name} onChange={handleChange} className={inputClass} />
              </div>
            );
          case 'email':
            return (
              <div key={field} className={wrapperClass}>
                <input type="email" name="email" placeholder="EMAIL ADDRESS *" value={formData.email} onChange={handleChange} required className={inputClass} />
              </div>
            );
          case 'phone':
            return (
              <div key={field} className={`${wrapperClass} flex items-center gap-3 sm:gap-4`}>
                {/* Custom Styled Country Code Dropdown */}
                <div className="relative flex items-center shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-transparent text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase text-brand-black focus:outline-none appearance-none cursor-pointer pr-4"
                  >
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  {/* Custom Chevron to replace default arrow */}
                  <i className="fa-solid fa-chevron-down absolute right-0 text-[8px] pointer-events-none text-brand-black"></i>
                </div>
                
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="PHONE NO. *" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  className={inputClass} 
                />
              </div>
            );
          case 'city':
            return (
              <div key={field} className="flex flex-col gap-4">
                <div className={`${wrapperClass} relative`}>
                  <select
                    value={citySelection}
                    onChange={(e) => setCitySelection(e.target.value)}
                    required
                    className={`w-full bg-transparent text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase focus:outline-none appearance-none cursor-pointer ${citySelection === "" ? 'text-brand-gray' : 'text-brand-black'}`}
                  >
                    <option value="" disabled className="text-brand-gray">SELECT CITY *</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Perth">Perth</option>
                    <option value="Adelaide">Adelaide</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {citySelection === 'Other' && (
                  <div className={`${wrapperClass} animate-in slide-in-from-top-2 duration-300`}>
                    <input type="text" placeholder="ENTER YOUR CITY *" value={customCity} onChange={(e) => setCustomCity(e.target.value)} required className={inputClass} />
                  </div>
                )}
              </div>
            );
          case 'company_name':
            return (
              <div key={field} className={wrapperClass}>
                <input type="text" name="company_name" placeholder="COMPANY NAME" value={formData.company_name} onChange={handleChange} className={inputClass} />
              </div>
            );
          case 'total_guests':
            return (
              <div key={field} className={wrapperClass}>
                <input type="number" name="total_guests" placeholder="TOTAL GUESTS" value={formData.total_guests} onChange={handleChange} className={inputClass} />
              </div>
            );
          case 'dob':
             return (
               <div key={field} className={wrapperClass}>
                 <input type="date" name="dob" placeholder="DATE OF BIRTH" value={formData.dob} onChange={handleChange} className={inputClass} />
               </div>
             );
          case 'description':
            return (
              <div key={field} className={wrapperClass}>
                <textarea name="description" placeholder="DESCRIPTION" value={formData.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
              </div>
            );
          default:
            return null;
        }
      })}

      <button
        type="submit"
        disabled={formStatus === 'loading'}
        className="btn-monumental w-full py-3 sm:py-4 md:py-5 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase mt-2 sm:mt-4 disabled:opacity-50"
      >
        <span>{formStatus === 'loading' ? 'Submitting...' : buttonText}</span>
      </button>
    </form>
  );
}