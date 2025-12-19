
import React, { useState, useEffect } from 'react';
import { FormConfig } from '../../types';
import { DEFAULT_FORM_CONFIG } from '../../config';
import { AdminPageHeader } from '../../components/admin';

// Default links structure for initial state
const DEFAULT_LINKS: Record<string, string> = {
    '1': 'https://mpy.ro/a60vgs6ht?language=ro',
    '2': 'https://mpy.ro/a60vgxdht?language=ro',
    '3': 'https://mpy.ro/a60vgxeht?language=ro',
    
    // Grupuri Specifice
    'grup_2': 'https://mpy.ro/a60vgxfht?language=ro',
    'grup_3': 'https://mpy.ro/a60vgxght?language=ro',
    'grup_4': 'https://mpy.ro/a60vgxiht?language=ro',
    'grup_5': 'https://mpy.ro/a60vgxqht?language=ro',
    'grup_6': 'https://mpy.ro/a60vgxrht?language=ro',
    'grup_7': 'https://mpy.ro/a60vgxsht?language=ro',
    'grup_8': 'https://mpy.ro/a60vgxtht?language=ro',
    'grup_9': 'https://mpy.ro/a60vgxuht?language=ro',
    'grup_10': 'https://mpy.ro/a60vgxvht?language=ro',

    // Fallbacks
    'grup_mic': 'https://mpy.ro/a60vgxfht?language=ro',
    'grup_mare': 'https://mpy.ro/a60vgxght?language=ro',
};

const PaymentLinks: React.FC = () => {
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>(DEFAULT_LINKS);
  const [vouchers, setVouchers] = useState<string[]>([]);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const loadData = () => {
    const storedLinks = localStorage.getItem('paymentLinks');
    if (storedLinks) {
        try {
            const parsedLinks = JSON.parse(storedLinks);
            setPaymentLinks({ ...DEFAULT_LINKS, ...parsedLinks });
        } catch(e) { console.error(e); }
    } else {
        setPaymentLinks(DEFAULT_LINKS);
    }

    // Load active vouchers to generate input fields
    const storedConfig = localStorage.getItem('formConfig');
    if(storedConfig) {
        try {
            const parsedConfig: FormConfig = JSON.parse(storedConfig);
            if(parsedConfig.vouchers) {
                setVouchers(parsedConfig.vouchers.filter(v => v.active).map(v => v.code));
            }
        } catch(e) {}
    } else {
        // Fallback to default if not in storage yet
        if (DEFAULT_FORM_CONFIG.vouchers) {
             setVouchers(DEFAULT_FORM_CONFIG.vouchers.filter(v => v.active).map(v => v.code));
        }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveLinks = () => {
      localStorage.setItem('paymentLinks', JSON.stringify(paymentLinks));
      setSaveStatus('Linkuri salvate!');
      setIsEditingLinks(false);
      setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleCancel = () => {
      loadData();
      setIsEditingLinks(false);
  };

  const individualCats = ['1', '2', '3'];
  
  // Generate specific group keys from 2 to 10 (Festival Maximum)
  const groupSpecificCats = Array.from({ length: 9 }, (_, i) => `grup_${i + 2}`);

  const renderLinkInput = (key: string, label: string, placeholder: string = "https://mpy.ro/...") => (
      <div key={key} className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block truncate">
              {label}
          </label>
          <input 
            disabled={!isEditingLinks}
            value={paymentLinks[key] || ''}
            onChange={(e) => setPaymentLinks({...paymentLinks, [key]: e.target.value})}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 text-sm text-gray-900 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
          />
      </div>
  );

  return (
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          <AdminPageHeader 
                title="Linkuri de Plată"
                description="Configurează URL-urile Netopia pentru fiecare pachet."
                isEditing={isEditingLinks}
                onEdit={() => setIsEditingLinks(true)}
                onSave={handleSaveLinks}
                onCancel={handleCancel}
                saveStatus={saveStatus}
          />

          <div className="space-y-10">
              {/* Individual Links */}
              <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                      👤 Pachete Individuale
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {individualCats.map(key => renderLinkInput(key, `${key} PIESĂ/PIESE`))}
                  </div>
              </div>

              {/* Group Specific Links */}
              <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                      👥 Grupuri (Specific per Număr Membri: 2 - 10)
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded border border-blue-100">
                      <strong>Prioritate:</strong> Dacă există un link completat aici (ex: Grup 4 Pers), acesta va fi folosit. Altfel, se va folosi link-ul generic de mai jos (Grup Mic/Mare).
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {groupSpecificCats.map(key => {
                          const count = key.split('_')[1];
                          return renderLinkInput(key, `GRUP ${count} PERS`);
                      })}
                  </div>
              </div>

              {/* Group Fallback Links */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      ⚠️ Linkuri Fallback (Generale)
                  </h3>
                  <p className="text-xs text-yellow-700 mb-4">
                      Aceste link-uri sunt folosite <strong>DOAR</strong> dacă nu există un link specific definit mai sus pentru numărul respectiv de membri.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderLinkInput('grup_mic', 'GRUP MIC (2-5 Persoane)')}
                      {renderLinkInput('grup_mare', 'GRUP MARE (6-10 Persoane)')}
                  </div>
              </div>

              {/* Voucher Specific Links */}
              {vouchers.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">🎫 Linkuri Specifice pentru Vouchere</h3>
                      <p className="text-xs text-gray-500 mb-6">Definește link-uri cu preț redus pentru fiecare voucher. Dacă lași gol, se va folosi link-ul standard.</p>
                      
                      {vouchers.map(voucherCode => (
                          <div key={voucherCode} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                              <h4 className="font-bold text-indigo-900 mb-4 border-b border-indigo-200 pb-2">Pentru codul: <span className="text-brand-pink">{voucherCode}</span></h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  {individualCats.map(catKey => renderLinkInput(`${catKey}_${voucherCode}`, `${catKey} PIESE (Redus)`, `Link ${voucherCode}`))}
                              </div>
                              
                              {/* We only show general group fallbacks for vouchers to save space, usually enough */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {renderLinkInput(`grup_mic_${voucherCode}`, `GRUP MIC (Redus)`, `Link ${voucherCode}`)}
                                  {renderLinkInput(`grup_mare_${voucherCode}`, `GRUP MARE (Redus)`, `Link ${voucherCode}`)}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>
  );
};

export default PaymentLinks;
