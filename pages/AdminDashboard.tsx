
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
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <img src={settings.siteLogo} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-700" alt="Logo" />
             <div className="flex flex-col">
               <h2 className="text-[11px] font-black tracking-widest uppercase opacity-80">Admin Center</h2>
               <span className="text-[9px] text-slate-500 font-bold truncate max-w-[120px]">{settings.siteName}</span>
             </div>
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

      <main className="flex-1 overflow-y-auto bg-slate-100">
        <div className="p-10 h-full">
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
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage master layouts and publications.</p>
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
              <h3 className="font-black text-slate-800 uppercase tracking-tight truncate">{t.name}</h3>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.photoFields.length} Photos / {t.textFields.length} Texts</span>
                <button 
                  onClick={() => {
                    const updated = templates.map(x => x.id === t.id ? { ...x, isActive: !x.isActive } : x);
                    setTemplates(updated);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-colors ${t.isActive ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  {t.isActive ? 'Active' : 'Inactive'}
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
  const { id } = useParams();
  const navigate = useNavigate();
  const template = templates.find(t => t.id === id);

  if (!template) return <div className="p-10 text-center font-bold text-slate-400">Template not found.</div>;

  const [activeField, setActiveField] = useState<{ type: 'text' | 'photo', id: string } | null>(null);
  const [scale, setScale] = useState(1);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialFieldPos = useRef({ x: 0, y: 0 });

  const updateTemplate = useCallback((updates: Partial<Template>) => {
    setTemplates((prev: Template[]) => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [id, setTemplates]);

  const updateScale = useCallback(() => {
    if (canvasContainerRef.current) {
      const cw = canvasContainerRef.current.offsetWidth - 120;
      const ch = canvasContainerRef.current.offsetHeight - 120;
      const s = Math.min(cw / template.canvasDimensions.width, ch / template.canvasDimensions.height);
      setScale(Math.max(0.1, s));
    }
  }, [template.canvasDimensions.width, template.canvasDimensions.height]);

  useEffect(() => {
    updateScale();
    const timer = setTimeout(updateScale, 150);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, [updateScale]);

  const handleMouseDown = (e: React.MouseEvent, type: 'text' | 'photo', fieldId: string) => {
    e.stopPropagation();
    setActiveField({ type, id: fieldId });
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    const field = type === 'text' 
      ? template.textFields.find(f => f.id === fieldId)
      : template.photoFields.find(f => f.id === fieldId);
      
    if (field) {
      initialFieldPos.current = { x: field.position.x, y: field.position.y };
    }
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !activeField) return;

    const dx = (e.clientX - dragStartPos.current.x) / scale;
    const dy = (e.clientY - dragStartPos.current.y) / scale;

    if (activeField.type === 'text') {
      const updated = template.textFields.map(f => f.id === activeField.id ? { 
        ...f, 
        position: { x: Math.round(initialFieldPos.current.x + dx), y: Math.round(initialFieldPos.current.y + dy) } 
      } : f);
      updateTemplate({ textFields: updated });
    } else {
      const updated = template.photoFields.map(f => f.id === activeField.id ? { 
        ...f, 
        position: { x: Math.round(initialFieldPos.current.x + dx), y: Math.round(initialFieldPos.current.y + dy) } 
      } : f);
      updateTemplate({ photoFields: updated });
    }
  }, [activeField, scale, template.textFields, template.photoFields, updateTemplate]);

  const handleGlobalMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const addTextField = () => {
    const newField: TextField = {
      id: `text-${Date.now()}`,
      label: 'New Text',
      placeholder: 'Enter content...',
      position: { x: 50, y: 50 },
      width: 400,
      fontSize: 32,
      color: '#000000',
      textBackgroundColor: 'transparent',
      fontWeight: '700',
      fontFamily: 'Inter',
      textAlign: 'left',
      isVisible: true
    };
    updateTemplate({ textFields: [...template.textFields, newField] });
    setActiveField({ type: 'text', id: newField.id });
  };

  const addPhotoField = () => {
    const newField: PhotoField = {
      id: `photo-${Date.now()}`,
      label: 'New Photo',
      position: { x: 50, y: 50 },
      dimensions: { width: 200, height: 200 },
      borderRadius: 0,
      borderColor: '#ffffff',
      borderWidth: 0,
      isVisible: true
    };
    updateTemplate({ photoFields: [...template.photoFields, newField] });
    setActiveField({ type: 'photo', id: newField.id });
  };

  const removeField = (type: 'text' | 'photo', fieldId: string) => {
    if (window.confirm('Delete this layer?')) {
      if (type === 'text') {
        updateTemplate({ textFields: template.textFields.filter(f => f.id !== fieldId) });
      } else {
        updateTemplate({ photoFields: template.photoFields.filter(f => f.id !== fieldId) });
      }
      setActiveField(null);
    }
  };

  const toggleVisibility = (type: 'text' | 'photo', fieldId: string) => {
    if (type === 'text') {
      const updated = template.textFields.map(f => f.id === fieldId ? { ...f, isVisible: f.isVisible === false } : f);
      updateTemplate({ textFields: updated });
    } else {
      const updated = template.photoFields.map(f => f.id === fieldId ? { ...f, isVisible: f.isVisible === false } : f);
      updateTemplate({ photoFields: updated });
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          updateTemplate({ 
            backgroundImage: base64,
            canvasDimensions: { width: img.naturalWidth, height: img.naturalHeight }
          });
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const activeText = activeField?.type === 'text' ? template.textFields.find(f => f.id === activeField.id) : null;
  const activePhoto = activeField?.type === 'photo' ? template.photoFields.find(f => f.id === activeField.id) : null;

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
        <div className="flex items-center gap-5">
           <Link to="../" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 group">
             <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div className="flex flex-col">
             <input type="text" className="text-2xl font-black text-slate-800 tracking-tight border-none focus:ring-0 rounded-xl bg-transparent px-0" value={template.name} onChange={e => updateTemplate({ name: e.target.value })} />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{template.canvasDimensions.width}x{template.canvasDimensions.height}px • Designer Workspace</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('../')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all">Save & Exit</button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-6 gap-8 min-h-0">
        <div 
          ref={canvasContainerRef} 
          onMouseDown={() => setActiveField(null)}
          className="xl:col-span-4 bg-slate-200/50 rounded-[48px] relative overflow-hidden flex items-center justify-center border-4 border-dashed border-white/40"
        >
           <div 
             ref={canvasRef}
             onMouseDown={(e) => e.stopPropagation()}
             className="relative shadow-2xl bg-white origin-center flex-shrink-0"
             style={{
               width: `${template.canvasDimensions.width}px`,
               height: `${template.canvasDimensions.height}px`,
               transform: `scale(${scale})`,
               backgroundImage: `url(${template.backgroundImage})`,
               backgroundSize: template.backgroundMode === 'stretch' ? '100% 100%' : template.backgroundMode,
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }}
           >
             {template.photoFields.filter(f => f.isVisible !== false).map(f => (
               <div 
                 key={f.id} 
                 onMouseDown={(e) => handleMouseDown(e, 'photo', f.id)}
                 className={`absolute cursor-move transition-all ${activeField?.id === f.id ? 'ring-4 ring-blue-500 z-20' : 'hover:ring-2 hover:ring-blue-300'}`}
                 style={{
                   left: `${f.position.x}px`, top: `${f.position.y}px`,
                   width: `${f.dimensions.width}px`, height: `${f.dimensions.height}px`,
                   borderRadius: `${f.borderRadius}px`, borderColor: f.borderColor, borderWidth: `${f.borderWidth}px`,
                   borderStyle: 'solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   backgroundColor: 'rgba(59, 130, 246, 0.1)'
                 }}
               >
                 <span className="text-[10px] font-black uppercase text-blue-500/50">{f.label}</span>
                 {activeField?.id === f.id && (
                   <button onMouseDown={(e) => { e.stopPropagation(); removeField('photo', f.id); }} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-30">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                 )}
               </div>
             ))}
             {template.textFields.filter(f => f.isVisible !== false).map(f => (
               <div 
                 key={f.id} 
                 onMouseDown={(e) => handleMouseDown(e, 'text', f.id)}
                 className={`absolute cursor-move transition-all ${activeField?.id === f.id ? 'ring-4 ring-blue-500 z-20 rounded' : 'hover:ring-2 hover:ring-blue-300'}`}
                 style={{
                   left: `${f.position.x}px`, top: `${f.position.y}px`, width: `${f.width}px`,
                   fontSize: `${f.fontSize}px`, color: f.color, backgroundColor: f.textBackgroundColor,
                   fontWeight: f.fontWeight, fontFamily: f.fontFamily, textAlign: f.textAlign, lineHeight: 1.2,
                   padding: '2px'
                 }}
               >
                 {f.placeholder}
                 {activeField?.id === f.id && (
                    <button onMouseDown={(e) => { e.stopPropagation(); removeField('text', f.id); }} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 )}
               </div>
             ))}
           </div>
        </div>

        <div className="xl:col-span-2 flex flex-col space-y-6 overflow-y-auto pr-2 scrollbar-hide">
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
             <div className="flex gap-4 mb-8">
                <button onClick={addPhotoField} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl">+ Photo Layer</button>
                <button onClick={addTextField} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl">+ Text Layer</button>
             </div>

             {!activeField ? (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest border-b pb-4">Template Settings</p>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Artwork Background</label>
                    <div className="relative group overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center hover:bg-slate-100 transition-all cursor-pointer">
                       {template.backgroundImage && <img src={template.backgroundImage} className="w-full h-32 object-cover rounded-2xl mb-4 shadow-md" alt="Asset" />}
                       <span className="text-[10px] font-black text-blue-600 uppercase mb-1">Click to Upload Image</span>
                       <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleBackgroundUpload} />
                       <p className="text-[8px] text-slate-400 text-center uppercase font-bold leading-none">Sets Canvas Dimensions Automatically</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Width (px)</label>
                        <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={template.canvasDimensions.width} onChange={e => updateTemplate({ canvasDimensions: {...template.canvasDimensions, width: parseInt(e.target.value) || 0} })} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Height (px)</label>
                        <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={template.canvasDimensions.height} onChange={e => updateTemplate({ canvasDimensions: {...template.canvasDimensions, height: parseInt(e.target.value) || 0} })} />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Background Mode</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold appearance-none cursor-pointer" 
                      value={template.backgroundMode} 
                      onChange={e => updateTemplate({ backgroundMode: e.target.value as any })}
                    >
                       <option value="stretch">Fill Workspace (Stretch)</option>
                       <option value="contain">Fit Workspace (Ratio)</option>
                       <option value="cover">Crop to Workspace</option>
                    </select>
                  </div>

                  <div className="pt-4">
                     <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                       <input type="checkbox" checked={template.isActive} onChange={e => updateTemplate({ isActive: e.target.checked })} className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" />
                       <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-slate-700">Publish Design</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Make it available to public users</span>
                       </div>
                     </label>
                  </div>
               </div>
             ) : (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
                  <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] uppercase">
                         {activeField.type[0]}
                       </div>
                       <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{activeField.type} layer</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => toggleVisibility(activeField.type, activeField.id)} className="p-2 hover:bg-white rounded-lg transition-all" title="Toggle Visibility">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {(activeText?.isVisible === false || activePhoto?.isVisible === false) ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            )}
                          </svg>
                       </button>
                       <button onClick={() => setActiveField(null)} className="p-2 hover:bg-white rounded-lg transition-all"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Field Label</label>
                        <input className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activeText?.label ?? activePhoto?.label ?? ''} onChange={e => {
                           const val = e.target.value;
                           if(activeField.type === 'text') updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, label:val} : f) });
                           else updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, label:val} : f) });
                        }} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">X-Position</label>
                        <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activeText?.position.x ?? activePhoto?.position.x ?? 0} onChange={e => {
                           const val = parseInt(e.target.value) || 0;
                           if(activeField.type === 'text') updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, position: {...f.position, x:val}} : f) });
                           else updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, position: {...f.position, x:val}} : f) });
                        }} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Y-Position</label>
                        <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activeText?.position.y ?? activePhoto?.position.y ?? 0} onChange={e => {
                           const val = parseInt(e.target.value) || 0;
                           if(activeField.type === 'text') updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, position: {...f.position, y:val}} : f) });
                           else updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, position: {...f.position, y:val}} : f) });
                        }} />
                     </div>
                     {activeField.type === 'text' && (
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Width Constraint</label>
                           <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activeText?.width ?? 0} onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, width:val} : f) });
                           }} />
                        </div>
                     )}
                  </div>

                  {activeField.type === 'text' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Typography</label>
                          <select className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold appearance-none cursor-pointer" value={activeText?.fontFamily} onChange={e => updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, fontFamily:e.target.value} : f) })}>
                             {FONT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Size</label>
                             <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activeText?.fontSize} onChange={e => updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, fontSize:parseInt(e.target.value) || 0} : f) })} />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Color</label>
                             <input type="color" className="w-full h-11 p-1 bg-slate-50 border-none rounded-xl cursor-pointer" value={activeText?.color} onChange={e => updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, color:e.target.value} : f) })} />
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Alignment</label>
                          <div className="flex bg-slate-50 p-1 rounded-xl">
                             {(['left', 'center', 'right'] as const).map(align => (
                               <button 
                                 key={align}
                                 onClick={() => updateTemplate({ textFields: template.textFields.map(f => f.id === activeField.id ? {...f, textAlign:align} : f) })}
                                 className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeText?.textAlign === align ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                               >
                                 {align}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {activeField.type === 'photo' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Width</label>
                             <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activePhoto?.dimensions.width} onChange={e => updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, dimensions: {...f.dimensions, width:parseInt(e.target.value) || 0}} : f) })} />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Height</label>
                             <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activePhoto?.dimensions.height} onChange={e => updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, dimensions: {...f.dimensions, height:parseInt(e.target.value) || 0}} : f) })} />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Corners</label>
                             <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activePhoto?.borderRadius} onChange={e => updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, borderRadius:parseInt(e.target.value) || 0} : f) })} />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stroke</label>
                             <input type="number" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold shadow-inner" value={activePhoto?.borderWidth} onChange={e => updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, borderWidth:parseInt(e.target.value) || 0} : f) })} />
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stroke Color</label>
                          <input type="color" className="w-full h-11 p-1 bg-slate-50 border-none rounded-xl cursor-pointer" value={activePhoto?.borderColor} onChange={e => updateTemplate({ photoFields: template.photoFields.map(f => f.id === activeField.id ? {...f, borderColor:e.target.value} : f) })} />
                       </div>
                    </div>
                  )}

                  <div className="pt-6 border-t mt-4">
                     <button onClick={() => removeField(activeField.type, activeField.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       Delete This Layer
                     </button>
                  </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<{ settings: AppSettings, setSettings: any }> = ({ settings, setSettings }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, siteLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-5xl font-black text-slate-800 tracking-tighter uppercase">Settings</h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">Manage your brand and security credentials.</p>
      </header>

      <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100 space-y-8">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">App Brand Name</label>
          <input 
            type="text" 
            value={settings.siteName} 
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Brand Logo Asset</label>
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-6">
                <img src={settings.siteLogo} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-xl" alt="Preview" />
                <div className="relative flex-1">
                   <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <div className="w-full py-6 px-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl text-center text-blue-600 font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all">
                      Click to Upload Brand Logo
                   </div>
                </div>
             </div>
             <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Direct Logo URL (Fallback)</label>
               <input 
                 type="text" 
                 value={settings.siteLogo.startsWith('data:') ? 'Custom Uploaded Base64 File' : settings.siteLogo} 
                 disabled={settings.siteLogo.startsWith('data:')}
                 onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                 className="w-full px-6 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
               />
               {settings.siteLogo.startsWith('data:') && (
                 <button onClick={() => setSettings({...settings, siteLogo: 'https://picsum.photos/id/1/200/200'})} className="text-[9px] font-bold text-blue-600 uppercase hover:underline ml-1">Reset to Default Logo</button>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-2 pt-6 border-t border-slate-50">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Admin Access Password</label>
          <input 
            type="password" 
            value={settings.adminPassword} 
            onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
          <p className="text-[10px] text-slate-400 font-medium mt-2 px-1">Note: Use this password at /{ADMIN_URL_SLUG}/login to access this panel.</p>
        </div>
      </div>
    </div>
  );
};
