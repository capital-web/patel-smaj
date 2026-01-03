
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Template, AppSettings } from '../types';
import { ADMIN_URL_SLUG } from '../constants';

interface HomeProps {
  templates: Template[];
  settings: AppSettings;
}

export const Home: React.FC<HomeProps> = ({ templates, settings }) => {
  const activeTemplates = templates.filter(t => t.isActive);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(activeTemplates[0] || templates[0]);
  const [userTexts, setUserTexts] = useState<Record<string, string>>({});
  const [userPhotos, setUserPhotos] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [activePhotoFieldId, setActivePhotoFieldId] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const padding = 32; 
        const containerWidth = containerRef.current.offsetWidth - padding;
        const containerHeight = containerRef.current.offsetHeight - padding;
        const scaleW = containerWidth / selectedTemplate.canvasDimensions.width;
        const scaleH = containerHeight / selectedTemplate.canvasDimensions.height;
        setPreviewScale(Math.min(scaleW, scaleH));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTemplate]);

  useEffect(() => {
    const texts: Record<string, string> = {};
    selectedTemplate.textFields.forEach(f => texts[f.id] = '');
    setUserTexts(texts);
    setUserPhotos({});
    setErrorMsg(null);
  }, [selectedTemplate]);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setActivePhotoFieldId(fieldId);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels || !activePhotoFieldId) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageToCrop;
    await new Promise((resolve) => { img.onload = resolve; });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
    setUserPhotos(prev => ({ ...prev, [activePhotoFieldId]: canvas.toDataURL('image/png', 1.0) }));
    setImageToCrop(null);
    setActivePhotoFieldId(null);
    setErrorMsg(null);
  };

  const isFormValid = useMemo(() => {
    const allTextsFilled = selectedTemplate.textFields.every(f => userTexts[f.id] && userTexts[f.id].trim() !== '');
    const allPhotosFilled = selectedTemplate.photoFields.every(f => userPhotos[f.id]);
    return allTextsFilled && allPhotosFilled;
  }, [selectedTemplate, userTexts, userPhotos]);

  const downloadHD = async () => {
    if (!isFormValid) {
      setErrorMsg("All fields are required. Please upload your photo and fill in your details.");
      return;
    }
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    setErrorMsg(null);

    try {
      // Small delay to ensure state is clear
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(previewRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[data-capture-area]') as HTMLElement;
          if (el) {
            // Absolute positioning reset is crucial for accurate html2canvas output
            el.style.transform = 'none';
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.visibility = 'visible';
          }
        }
      });
      
      const fileName = `${selectedTemplate.name.replace(/\s+/g, '_')}_HD_Export.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      setErrorMsg("Export failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getBackgroundSize = () => {
    if (selectedTemplate.backgroundMode === 'stretch') return '100% 100%';
    return selectedTemplate.backgroundMode;
  };

  if (activeTemplates.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm">
           <h2 className="text-xl font-bold text-slate-800">No active designs</h2>
           <Link to={`/${ADMIN_URL_SLUG}/login`} className="mt-6 inline-block text-blue-600 font-bold uppercase text-[10px] tracking-widest border border-blue-100 px-6 py-2 rounded-full hover:bg-blue-50">Admin Access</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 relative h-screen overflow-hidden">
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl aspect-square bg-slate-900 rounded-3xl overflow-hidden mb-4 shadow-2xl">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={selectedTemplate.photoFields.find(f => f.id === activePhotoFieldId)?.dimensions.width! / selectedTemplate.photoFields.find(f => f.id === activePhotoFieldId)?.dimensions.height!}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="w-full max-w-md px-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Adjust Zoom</span>
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{zoom.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="4" 
              step="0.1" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))} 
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex gap-4">
             <button onClick={() => setImageToCrop(null)} className="px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">Cancel</button>
             <button onClick={createCroppedImage} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-500 transition-all uppercase tracking-widest text-xs">Set Photo</button>
          </div>
        </div>
      )}

      <div className="w-full md:w-96 p-6 bg-white shadow-xl z-10 overflow-y-auto flex flex-col border-r border-slate-100">
        <header className="mb-6 flex items-center gap-4">
          <img src={settings.siteLogo} alt="Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{settings.siteName}</h1>
        </header>

        <section className="space-y-6 flex-1">
          {activeTemplates.length > 1 && (
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Choose Your Template</label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                {activeTemplates.map(t => (
                  <button key={t.id} onClick={() => setSelectedTemplate(t)} className={`p-1 rounded-xl border-2 transition-all ${selectedTemplate.id === t.id ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20' : 'border-slate-50 hover:border-slate-200'}`}>
                    <img src={t.backgroundImage} className="w-full aspect-video object-cover rounded-lg" alt={t.name} />
                    <p className="text-[10px] mt-1.5 font-bold text-slate-600 truncate px-1">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest">Personalize Your Card</label>
            {selectedTemplate.textFields.map(f => (
              <div key={f.id} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-wider">{f.label}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                  value={userTexts[f.id] || ''} 
                  onChange={(e) => {
                    setUserTexts(p => ({ ...p, [f.id]: e.target.value }));
                    setErrorMsg(null);
                  }} 
                  placeholder={f.placeholder} 
                  required
                />
              </div>
            ))}
            {selectedTemplate.photoFields.map(f => (
              <div key={f.id} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-wider">{f.label}</label>
                <div className="relative group">
                   <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handlePhotoUpload(e, f.id)} />
                   <div className={`py-3 px-4 border-2 border-dashed rounded-xl flex items-center gap-3 transition-all ${userPhotos[f.id] ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                      {userPhotos[f.id] ? <img src={userPhotos[f.id]} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-white" /> : <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                      <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider leading-none">{userPhotos[f.id] ? 'Change & Re-crop' : 'Upload & Crop Photo'}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {errorMsg && <p className="text-red-500 text-[11px] font-bold text-center mt-2 animate-pulse">{errorMsg}</p>}

          <button 
            onClick={downloadHD} 
            disabled={isDownloading} 
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${!isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] text-white active:scale-95'}`}
          >
            {isDownloading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>}
            <span>Download Final Design</span>
          </button>
        </section>

        <footer className="mt-6 pt-4 border-t border-slate-50 text-center">
           <Link to={`/${ADMIN_URL_SLUG}/login`} className="text-[9px] font-black text-slate-300 hover:text-blue-500 uppercase tracking-widest transition-colors">Admin Settings</Link>
        </footer>
      </div>

      <div ref={containerRef} className="flex-1 flex items-center justify-center bg-slate-100 overflow-hidden relative p-4">
        <div 
          ref={previewRef}
          data-capture-area
          className="bg-white shadow-2xl relative flex-shrink-0"
          style={{
            width: `${selectedTemplate.canvasDimensions.width}px`,
            height: `${selectedTemplate.canvasDimensions.height}px`,
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
            backgroundImage: `url(${selectedTemplate.backgroundImage})`,
            backgroundSize: getBackgroundSize(),
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {selectedTemplate.photoFields.map(f => (
            <div key={f.id} className="absolute overflow-hidden" style={{
              left: `${f.position.x}px`, top: `${f.position.y}px`,
              width: `${f.dimensions.width}px`, height: `${f.dimensions.height}px`,
              borderRadius: `${f.borderRadius}px`, borderColor: f.borderColor, borderWidth: `${f.borderWidth}px`,
              borderStyle: 'solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: userPhotos[f.id] ? 'transparent' : 'rgba(0,0,0,0.05)'
            }}>
              {userPhotos[f.id] && <img src={userPhotos[f.id]} className="w-full h-full object-cover" alt="User" />}
            </div>
          ))}
          {selectedTemplate.textFields.map(f => (
            <div key={f.id} className="absolute" style={{
              left: `${f.position.x}px`, 
              top: `${f.position.y}px`, 
              width: `${f.width}px`,
              fontSize: `${f.fontSize}px`, 
              color: f.color, 
              backgroundColor: f.textBackgroundColor || 'transparent',
              fontWeight: f.fontWeight,
              fontFamily: f.fontFamily, 
              textAlign: f.textAlign, 
              lineHeight: 1.2,
              padding: f.textBackgroundColor && f.textBackgroundColor !== 'transparent' ? '4px 10px' : '0'
            }}>
              {userTexts[f.id] || f.placeholder}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
