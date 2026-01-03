
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Template, AppSettings, Position, PhotoField, TextField } from '../types';
import { FONT_OPTIONS, ADMIN_URL_SLUG } from '../constants';

interface AdminDashboardProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  templates, setTemplates, settings, setSettings, onLogout 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <img src={settings.siteLogo} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-700" alt="Logo" />
             <h2 className="text-[11px] font-black tracking-widest uppercase opacity-80">Admin Center</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold text-xs uppercase tracking-wider group">
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Design Library
          </Link>
          <Link to="settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold text-xs uppercase tracking-wider group">
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Site Settings
          </Link>
          <div className="pt-8 px-2">
            <button onClick={() => {
              const id = `template-${Date.now()}`;
              const newT: Template = { 
                id, 
                name: 'New Design ' + (templates.length + 1),
                backgroundImage: 'https://picsum.photos/id/10/1200/800',
                backgroundMode: 'stretch',
                canvasDimensions: { width: 1200, height: 800 },
                photoFields: [],
                textFields: [],
                isActive: true
              };
              setTemplates([...templates, newT]);
              navigate(`edit/${id}`);
            }} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Create New Design
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full px-4 py-3 rounded-xl bg-red-950/40 text-red-300 hover:bg-red-800 transition-colors text-[10px] font-black uppercase tracking-widest">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          <Routes>
            <Route index element={<TemplatesList templates={templates} setTemplates={setTemplates} />} />
            <Route path="edit/:id" element={<TemplateEditor templates={templates} setTemplates={setTemplates} />} />
            <Route path="settings" element={<SettingsPanel settings={settings} setSettings={setSettings} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const TemplatesList: React.FC<{ templates: Template[], setTemplates: any }> = ({ templates, setTemplates }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
         <div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter uppercase">Library</h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage all master layouts.</p>
         </div>
         <div className="flex gap-4">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> Active: {templates.filter(t => t.isActive).length}
            </span>
         </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {templates.map(t => (
          <div key={t.id} className={`bg-white rounded-[32px] shadow-sm border transition-all relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 ${t.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60 hover:opacity-100'}`}>
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
              <img src={t.backgroundImage} className="w-full h-full object-cover" alt={t.name} />
              <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-8">
                <Link to={`edit/${t.id}`} className="w-full py-4 bg-white rounded-2xl text-slate-900 font-black text-[11px] text-center uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">Open Editor</Link>
                <button onClick={() => { if(window.confirm('Delete this template permanently?')) setTemplates(templates.filter(x => x.id !== t.id)) }} className="w-full py-4 bg-red-600 rounded-2xl text-white font-black text-[11px] uppercase tracking-widest hover:bg-red-500 transition-colors shadow-xl">Delete</button>
              </div>
              {!t.isActive && <div className="absolute top-4 right-4 px-3 py-1 bg-slate-800 text-white text-[8px] font-black rounded-full uppercase">Disabled</div>}
            </div>
            <div className="p-6">
              <h3 className="font-black text-slate-800 text-base truncate uppercase tracking-tight">{t.name}</h3>
              <div className="flex items-center justify-between mt-3">
                 <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">{t.canvasDimensions.width}x{t.canvasDimensions.height}</span>
                 <button onClick={() => setTemplates(templates.map(x => x.id === t.id ? {...x, isActive: !x.isActive} : x))} className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full ${t.isActive ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}`}>
                    {t.isActive ? 'Active' : 'Enable'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplateEditor: React.FC<{ templates: Template[], setTemplates: any }> = ({ templates, setTemplates }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const template = templates.find(t => t.id === id);

  if (!template) return <div className="p-12 text-center text-red-500 font-bold">Template Not Found</div>;

  const [localTemplate, setLocalTemplate] = useState<Template>(JSON.parse(JSON.stringify(template)));
  const [activeElement, setActiveElement] = useState<{ type: 'photo' | 'text', id: string } | null>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      if (canvasContainerRef.current) {
        const padding = 128; 
        const cw = canvasContainerRef.current.offsetWidth - padding;
        const ch = canvasContainerRef.current.offsetHeight - padding;
        const s = Math.min(cw / localTemplate.canvasDimensions.width, ch / localTemplate.canvasDimensions.height, 1);
        setPreviewScale(s);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [localTemplate.canvasDimensions]);

  const handleSave = () => {
    setTemplates(templates.map(t => t.id === id ? localTemplate : t));
    navigate(`/${ADMIN_URL_SLUG}/dashboard`);
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (!editorRef.current || !activeElement) return;
    const rect = editorRef.current.getBoundingClientRect();
    const currentEffectiveScale = previewScale * zoomFactor;
    const x = Math.round((clientX - rect.left) / currentEffectiveScale);
    const y = Math.round((clientY - rect.top) / currentEffectiveScale);

    if (activeElement.type === 'photo') {
      const field = localTemplate.photoFields.find(f => f.id === activeElement.id);
      if (!field) return;
      setLocalTemplate(p => ({
        ...p,
        photoFields: p.photoFields.map(f => f.id === activeElement.id ? { ...f, position: { x: x - f.dimensions.width / 2, y: y - f.dimensions.height / 2 } } : f)
      }));
    } else {
      setLocalTemplate(p => ({
        ...p,
        textFields: p.textFields.map(f => f.id === activeElement.id ? { ...f, position: { x: x - 10, y: y - 10 } } : f)
      }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 && isDragging) onDragMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onload = () => {
        const result = r.result as string;
        const img = new Image();
        img.onload = () => {
          setLocalTemplate({
            ...localTemplate,
            backgroundImage: result,
            canvasDimensions: { width: img.naturalWidth, height: img.naturalHeight }
          });
        };
        img.src = result;
      };
      r.readAsDataURL(f);
    }
  };

  const deleteElement = (type: 'photo' | 'text', elementId: string) => {
    if(window.confirm('Are you sure you want to delete this layer?')) {
      if(type === 'photo') {
        setLocalTemplate(p => ({ ...p, photoFields: p.photoFields.filter(f => f.id !== elementId) }));
      } else {
        setLocalTemplate(p => ({ ...p, textFields: p.textFields.filter(f => f.id !== elementId) }));
      }
      setActiveElement(null);
    }
  };

  const getActiveData = () => activeElement?.type === 'photo' ? localTemplate.photoFields.find(f => f.id === activeElement.id) : localTemplate.textFields.find(f => f.id === activeElement.id);

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
        <div className="flex items-center gap-5">
           <Link to={`/${ADMIN_URL_SLUG}/dashboard`} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 group">
             <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div className="flex flex-col">
             <div className="flex items-center gap-3">
               <input type="text" className="text-2xl font-black text-slate-800 tracking-tight border-none focus:ring-0 rounded-xl bg-transparent px-0 w-auto" value={localTemplate.name} onChange={e => setLocalTemplate({...localTemplate, name: e.target.value})} placeholder="Edit Layout Name" />
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                 <input type="checkbox" id="isActive" checked={localTemplate.isActive} onChange={e => setLocalTemplate({...localTemplate, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                 <label htmlFor="isActive" className="text-[9px] font-black uppercase text-slate-500">Live</label>
               </div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Resolution: {localTemplate.canvasDimensions.width}x{localTemplate.canvasDimensions.height}px</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1">
             <button onClick={() => setZoomFactor(Math.max(0.1, zoomFactor - 0.1))} className="p-3 hover:bg-white rounded-xl text-slate-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
             </button>
             <span className="px-2 text-[10px] font-black text-slate-400 w-12 text-center">{Math.round(zoomFactor * 100)}%</span>
             <button onClick={() => setZoomFactor(zoomFactor + 0.1)} className="p-3 hover:bg-white rounded-xl text-slate-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
             </button>
          </div>
          <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 shadow-xl transition-all">Publish</button>
        </div>
      </header>

      {/* Grid ratio optimized for maximizing canvas workspace */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-6 gap-8 min-h-0">
        <div 
          ref={canvasContainerRef} 
          onClick={() => setActiveElement(null)}
          className="xl:col-span-5 bg-slate-200/40 rounded-[48px] relative overflow-auto flex items-center justify-center border-4 border-dashed border-white/40 touch-none"
        >
           <div 
             ref={editorRef}
             onClick={(e) => e.stopPropagation()}
             className="relative shadow-2xl bg-white origin-center flex-shrink-0"
             onMouseMove={handleMouseMove}
             onTouchMove={handleTouchMove}
             style={{
               width: `${localTemplate.canvasDimensions.width}px`,
               height: `${localTemplate.canvasDimensions.height}px`,
               transform: `scale(${previewScale * zoomFactor})`,
               backgroundImage: `url(${localTemplate.backgroundImage})`,
               backgroundSize: localTemplate.backgroundMode === 'stretch' ? '100% 100%' : localTemplate.backgroundMode,
               backgroundPosition: 'center', 
               backgroundRepeat: 'no-repeat'
             }}
           >
              {localTemplate.photoFields.map(f => (
                <div key={f.id} 
                  onMouseDown={(e) => { e.stopPropagation(); setActiveElement({type:'photo', id:f.id}); setIsDragging(true); }} 
                  onTouchStart={(e) => { e.stopPropagation(); setActiveElement({type:'photo', id:f.id}); setIsDragging(true); }}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchEnd={() => setIsDragging(false)}
                  className={`absolute border-4 flex items-center justify-center transition-all ${activeElement?.id === f.id ? 'border-blue-500 bg-blue-50/10 z-20 shadow-xl' : 'border-slate-300/30 bg-slate-100/5 opacity-50 hover:opacity-70'}`} 
                  style={{
                  left: `${f.position.x}px`, top: `${f.position.y}px`, width: `${f.dimensions.width}px`, height: `${f.dimensions.height}px`, borderRadius: `${f.borderRadius}px`, borderColor: f.borderColor, borderWidth: `${f.borderWidth}px`, borderStyle: 'solid'
                }}>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-[10px] font-black text-blue-600 uppercase">PHOTO</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteElement('photo', f.id); }}
                    className="absolute -top-4 -right-4 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 active:scale-95 transition-all z-30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
              {localTemplate.textFields.map(f => (
                <div key={f.id} 
                  onMouseDown={(e) => { e.stopPropagation(); setActiveElement({type:'text', id:f.id}); setIsDragging(true); }} 
                  onTouchStart={(e) => { e.stopPropagation(); setActiveElement({type:'text', id:f.id}); setIsDragging(true); }}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchEnd={() => setIsDragging(false)}
                  className={`absolute p-2 transition-all rounded ${activeElement?.id === f.id ? 'ring-4 ring-blue-500/30 bg-white shadow-xl z-20' : 'opacity-40 hover:opacity-70 cursor-pointer'}`} 
                  style={{
                  left: `${f.position.x}px`, 
                  top: `${f.position.y}px`, 
                  width: `${f.width}px`, 
                  fontSize: `${f.fontSize}px`, 
                  color: f.color, 
                  backgroundColor: f.textBackgroundColor || 'transparent',
                  fontWeight: f.fontWeight, 
                  fontFamily: f.fontFamily, 
                  textAlign: f.textAlign
                }}>
                  {f.label}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteElement('text', f.id); }}
                    className="absolute -top-4 -right-4 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 active:scale-95 transition-all z-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
           </div>
        </div>

        <div className="xl:col-span-1 flex flex-col space-y-6 overflow-y-auto pr-3 scrollbar-hide">
           <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-200">
             <div className="flex gap-2 mb-6">
                <button onClick={() => {
                  const nf: PhotoField = { id: `p-${Date.now()}`, label: 'Photo Layer', position: {x:100,y:100}, dimensions: {width:200,height:200}, borderRadius: 0, borderColor: '#fff', borderWidth: 0 };
                  setLocalTemplate(p => ({...p, photoFields:[...p.photoFields, nf]})); setActiveElement({type:'photo', id:nf.id});
                }} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">+ Photo</button>
                <button onClick={() => {
                  const nf: TextField = { id: `t-${Date.now()}`, label: 'Text Layer', placeholder: 'Sample Text', position: {x:100,y:350}, width: 400, fontSize: 32, color: '#000', textBackgroundColor: 'transparent', fontWeight: '700', fontFamily: 'Inter', textAlign: 'center' };
                  setLocalTemplate(p => ({...p, textFields:[...p.textFields, nf]})); setActiveElement({type:'text', id:nf.id});
                }} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">+ Text</button>
             </div>

             {!activeElement ? (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Global Canvas</p>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Master Artwork</label>
                    <div className="relative group overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center hover:bg-slate-100 transition-all cursor-pointer">
                       {localTemplate.backgroundImage && <img src={localTemplate.backgroundImage} className="w-full h-24 object-cover rounded-xl mb-3 shadow-md" alt="Asset" />}
                       <span className="text-[10px] font-black text-blue-600 uppercase mb-2 text-center">Change Source</span>
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleBgUpload} />
                       <p className="text-[8px] text-slate-400 text-center uppercase font-bold leading-none">Sets Canvas Res</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Background Scaling</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold appearance-none cursor-pointer" 
                      value={localTemplate.backgroundMode} 
                      onChange={e => setLocalTemplate({...localTemplate, backgroundMode: e.target.value as any})}
                    >
                       <option value="stretch">Fill (Stretch)</option>
                       <option value="contain">Fit (Ratio)</option>
                       <option value="cover">Cover (Fill & Crop)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Width (PX)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={localTemplate.canvasDimensions.width} onChange={e => setLocalTemplate({...localTemplate, canvasDimensions: {...localTemplate.canvasDimensions, width: parseInt(e.target.value) || 0}})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Height (PX)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={localTemplate.canvasDimensions.height} onChange={e => setLocalTemplate({...localTemplate, canvasDimensions: {...localTemplate.canvasDimensions, height: parseInt(e.target.value) || 0}})} />
                     </div>
                  </div>
               </div>
             ) : (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-400">
                  <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{activeElement.type} Config</span>
                    <button onClick={() => setActiveElement(null)} title="Hide Panel" className="p-2 hover:bg-white rounded-lg transition-all"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Fine-tune Position</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-600">
                          <span>X-Position</span>
                          <input type="number" className="w-16 bg-slate-50 px-2 py-1 rounded text-right border border-slate-100" value={Math.round(getActiveData()?.position.x || 0)} onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            if(activeElement.type === 'photo') setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, x: val}} : f)}));
                            else setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, x: val}} : f)}));
                          }} />
                        </div>
                        <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" min="-500" max={localTemplate.canvasDimensions.width} value={getActiveData()?.position.x || 0} onChange={e => {
                          const val = parseInt(e.target.value);
                          if(activeElement.type === 'photo') setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, x: val}} : f)}));
                          else setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, x: val}} : f)}));
                        }} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-600">
                          <span>Y-Position</span>
                          <input type="number" className="w-16 bg-slate-50 px-2 py-1 rounded text-right border border-slate-100" value={Math.round(getActiveData()?.position.y || 0)} onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            if(activeElement.type === 'photo') setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, y: val}} : f)}));
                            else setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, y: val}} : f)}));
                          }} />
                        </div>
                        <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" min="-500" max={localTemplate.canvasDimensions.height} value={getActiveData()?.position.y || 0} onChange={e => {
                          const val = parseInt(e.target.value);
                          if(activeElement.type === 'photo') setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, y: val}} : f)}));
                          else setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, position: {...f.position, y: val}} : f)}));
                        }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Layer Label</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={getActiveData()?.label} onChange={e => {
                           const val = e.target.value;
                           if(activeElement.type === 'photo') setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, label:val} : f)}));
                           else setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, label:val} : f)}));
                        }} />
                     </div>

                     {activeElement.type === 'photo' && (
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">Dimensions (PX) <span>{(getActiveData() as PhotoField).dimensions.width}px</span></label>
                             <input type="range" className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" min="20" max="1500" value={(getActiveData() as PhotoField).dimensions.width} onChange={e => {
                                const val = parseInt(e.target.value);
                                setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, dimensions:{width:val, height:val}} : f)}));
                             }} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">Corner Radius <span>{(getActiveData() as PhotoField).borderRadius}px</span></label>
                             <input type="range" className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" min="0" max="800" value={(getActiveData() as PhotoField).borderRadius} onChange={e => {
                                const val = parseInt(e.target.value);
                                setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, borderRadius: val} : f)}));
                             }} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase">Border Color</label>
                               <input type="color" className="w-full h-10 rounded-xl cursor-pointer border-none bg-slate-50 p-1" value={(getActiveData() as PhotoField).borderColor} onChange={e => setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, borderColor:e.target.value} : f)}))}/>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase">Border Width</label>
                               <input type="number" className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold" min="0" max="50" value={(getActiveData() as PhotoField).borderWidth} onChange={e => setLocalTemplate(p => ({...p, photoFields: p.photoFields.map(f => f.id === activeElement.id ? {...f, borderWidth:parseInt(e.target.value) || 0} : f)}))} />
                            </div>
                          </div>
                       </div>
                     )}

                     {activeElement.type === 'text' && (
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">Font Size <span>{(getActiveData() as TextField).fontSize}px</span></label>
                             <input type="range" className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" min="8" max="400" value={(getActiveData() as TextField).fontSize} onChange={e => setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, fontSize:parseInt(e.target.value)} : f)}))}/>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase">Text Color</label>
                               <input type="color" className="w-full h-10 rounded-xl cursor-pointer border-none bg-slate-50 p-1" value={(getActiveData() as TextField).color} onChange={e => setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, color:e.target.value} : f)}))}/>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase">Layer Background</label>
                               <div className="flex gap-2">
                                  <input type="color" className="flex-1 h-10 rounded-xl cursor-pointer bg-slate-50 p-1" value={(getActiveData() as TextField).textBackgroundColor === 'transparent' ? '#ffffff' : (getActiveData() as TextField).textBackgroundColor} onChange={e => setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, textBackgroundColor:e.target.value} : f)}))}/>
                                  <button onClick={() => setLocalTemplate(p => ({...p, textFields: p.textFields.map(f => f.id === activeElement.id ? {...f, textBackgroundColor:'transparent'} : f)}))} className="p-2 bg-slate-100 rounded-xl text-[8px] font-black uppercase hover:bg-slate-200 transition-colors">None</button>
                               </div>
                            </div>
                          </div>
                       </div>
                     )}
                     
                     <div className="pt-6 border-t border-slate-100">
                        <button onClick={() => deleteElement(activeElement.type, activeElement.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete Element
                        </button>
                     </div>
                  </div>
               </div>
             )}
           </div>
           
           <div className="bg-slate-900 p-6 rounded-[32px] text-white/40 text-[9px] font-bold uppercase tracking-widest flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p>Pro Tip: Use the canvas sliders for pixel-perfect positioning. The "X" button on side panel just deselects elements without deleting them.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  return (
    <div className="max-w-3xl animate-in slide-in-from-bottom-5 duration-700">
       <header className="mb-10">
         <h1 className="text-5xl font-black text-slate-800 tracking-tighter uppercase">Settings</h1>
         <p className="text-slate-500 mt-2 text-lg">Manage global site attributes and branding.</p>
       </header>

       <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-200 space-y-12">
          <div className="space-y-6">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Branding</label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-600 uppercase">Portal Name</label>
                     <input className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm shadow-inner" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-600 uppercase">Administrative Password</label>
                     <input type="password" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm tracking-widest shadow-inner" value={settings.adminPassword} onChange={e => setSettings({...settings, adminPassword: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-600 uppercase">Site Logo</label>
                   <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                      <img src={settings.siteLogo} className="w-24 h-24 object-cover rounded-2xl shadow-xl border-4 border-white" />
                      <input type="file" className="text-[10px] font-bold" onChange={e => {
                        const f = e.target.files?.[0];
                        if(f) { const r = new FileReader(); r.onload = () => setSettings({...settings, siteLogo: r.result as string}); r.readAsDataURL(f); }
                      }} />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
