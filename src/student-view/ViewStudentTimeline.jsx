import React, { useState, useEffect, useRef } from 'react';
import {
    ThumbsUp, ThumbsDown, Info, Star, AlertTriangle, Pin,
    PinOff, Edit3, Trash2, Check, X, Plus, Image as ImageIcon,
    Loader, StickyNote, User, ChevronDown
} from 'lucide-react';
import { API_URL } from '../config';

// ─── Note type config ────────────────────────────────────────────────────────
const NOTE_TYPES = [
    { value: 'Good', label: 'Good News', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    { value: 'Bad', label: 'Bad News', icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
    { value: 'Achievement', label: 'Achievement', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    { value: 'Warning', label: 'Warning', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
    { value: 'General', label: 'General', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
];

const getTypeConfig = (value) => NOTE_TYPES.find(t => t.value === value) || NOTE_TYPES[4];

// ─── Main Component ──────────────────────────────────────────────────────────
const ViewStudentTimeline = ({ studentId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Form state
    const [formText, setFormText] = useState('');
    const [formType, setFormType] = useState('General');
    const [formPhoto, setFormPhoto] = useState(null);
    const [formPhotoPreview, setFormPhotoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fileRef = useRef();

    // ── Fetch notes ───────────────────────────────────────────────────────────
    const fetchNotes = async () => {
        if (!studentId) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/students/${studentId}/notes`);
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            setNotes(data);
            setError(null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, [studentId]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const resetForm = () => {
        setFormText('');
        setFormType('General');
        setFormPhoto(null);
        setFormPhotoPreview(null);
        setShowForm(false);
        setEditingId(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormPhoto(file);
        setFormPhotoPreview(URL.createObjectURL(file));
    };

    // ── Submit (add or edit) ──────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!formText.trim()) return;
        setSubmitting(true);

        const fd = new FormData();
        fd.append('note_type', formType);
        fd.append('text', formText.trim());
        fd.append('author', 'Admin');
        if (formPhoto) fd.append('file', formPhoto);

        try {
            const url = editingId
                ? `${API_URL}/api/students/${studentId}/notes/${editingId}`
                : `${API_URL}/api/students/${studentId}/notes`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: fd });
            if (!res.ok) throw new Error('Failed to save note');
            resetForm();
            fetchNotes();
        } catch (e) {
            alert(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Open edit form ────────────────────────────────────────────────────────
    const startEdit = (note) => {
        setEditingId(note.id);
        setFormText(note.text);
        setFormType(note.note_type);
        setFormPhoto(null);
        setFormPhotoPreview(note.photo_url ? `${API_URL}${note.photo_url}` : null);
        setShowForm(true);
    };

    // ── Pin toggle ────────────────────────────────────────────────────────────
    const togglePin = async (noteId) => {
        try {
            await fetch(`${API_URL}/api/students/${studentId}/notes/${noteId}/pin`, { method: 'PATCH' });
            fetchNotes();
        } catch (e) { /* silent */ }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const deleteNote = async (noteId) => {
        try {
            await fetch(`${API_URL}/api/students/${studentId}/notes/${noteId}`, { method: 'DELETE' });
            setConfirmDeleteId(null);
            fetchNotes();
        } catch (e) { /* silent */ }
    };

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = NOTE_TYPES.map(t => ({
        ...t,
        count: notes.filter(n => n.note_type === t.value).length
    })).filter(t => t.count > 0);

    const pinnedNotes = notes.filter(n => n.is_pinned);
    const regularNotes = notes.filter(n => !n.is_pinned);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Header toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
                        <StickyNote size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base leading-tight">Student Notes</h3>
                        <p className="text-xs text-gray-400">{notes.length} {notes.length === 1 ? 'note' : 'notes'} — {pinnedNotes.length} pinned</p>
                    </div>
                </div>

                <button
                    onClick={() => { resetForm(); setShowForm(s => !s); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    {showForm && !editingId ? <X size={16} /> : <Plus size={16} />}
                    {showForm && !editingId ? 'Cancel' : 'Add Note'}
                </button>
            </div>

            {/* ── Quick stats ── */}
            {stats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {stats.map(t => {
                        const Icon = t.icon;
                        return (
                            <div key={t.value} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${t.bg} ${t.color} border ${t.border}`}>
                                <Icon size={12} />
                                {t.count} {t.label}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Add / Edit Form ── */}
            {showForm && (
                <div className="bg-white border border-indigo-100 rounded-2xl shadow-md overflow-hidden">
                    {/* Color bar */}
                    <div className={`h-1 w-full ${getTypeConfig(formType).dot}`} />
                    <div className="p-5 space-y-4">
                        <h4 className="font-semibold text-gray-700 text-sm">{editingId ? '✏️ Edit Note' : '📝 New Note'}</h4>

                        {/* Note type selector */}
                        <div className="flex flex-wrap gap-2">
                            {NOTE_TYPES.map(t => {
                                const Icon = t.icon;
                                const active = formType === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        onClick={() => setFormType(t.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? `${t.bg} ${t.color} ${t.border} shadow-sm scale-105` : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        <Icon size={12} /> {t.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Text area */}
                        <textarea
                            rows={3}
                            value={formText}
                            onChange={e => setFormText(e.target.value)}
                            placeholder="Write a note about this student..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        />

                        {/* Photo (optional icon/attachment) */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                            >
                                <ImageIcon size={14} /> Attach Photo
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            {formPhotoPreview && (
                                <div className="relative inline-block">
                                    <img src={formPhotoPreview} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                    <button
                                        onClick={() => { setFormPhoto(null); setFormPhotoPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleSubmit}
                                disabled={!formText.trim() || submitting}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                                {submitting ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                                {editingId ? 'Save Changes' : 'Save Note'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Loading / Error ── */}
            {loading && (
                <div className="flex items-center justify-center py-16 text-indigo-400">
                    <Loader size={28} className="animate-spin" />
                </div>
            )}
            {error && !loading && (
                <div className="text-center py-10 text-red-500 text-sm">{error}</div>
            )}

            {/* ── Empty State ── */}
            {!loading && !error && notes.length === 0 && (
                <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                        <StickyNote size={28} className="text-gray-300" />
                    </div>
                    <h4 className="font-semibold text-gray-400">No notes yet</h4>
                    <p className="text-gray-400 text-sm">Click <strong>Add Note</strong> to record something about this student.</p>
                </div>
            )}

            {/* ── Pinned Notes Section ── */}
            {!loading && pinnedNotes.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><Pin size={12} /> Pinned</p>
                    {pinnedNotes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onPin={togglePin}
                            onEdit={startEdit}
                            onDelete={id => setConfirmDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Regular Notes ── */}
            {!loading && regularNotes.length > 0 && (
                <div className="space-y-3">
                    {pinnedNotes.length > 0 && (
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">All Notes</p>
                    )}
                    {regularNotes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onPin={togglePin}
                            onEdit={startEdit}
                            onDelete={id => setConfirmDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Delete confirm modal ── */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full space-y-4 border border-gray-100">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 size={22} className="text-red-500" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-gray-800">Delete this note?</h4>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteNote(confirmDeleteId)}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Note Card Sub-component ─────────────────────────────────────────────────
const NoteCard = ({ note, onPin, onEdit, onDelete }) => {
    const cfg = getTypeConfig(note.note_type);
    const Icon = cfg.icon;

    const formatDate = (ts) => {
        if (!ts) return '';
        try {
            return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return ts; }
    };

    return (
        <div className={`relative bg-white border ${cfg.border} rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group`}>

            {/* Left color stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.dot}`} />

            {/* Pinned indicator ribbon */}
            {note.is_pinned && (
                <div className="absolute top-0 right-0">
                    <div className="w-0 h-0 border-t-[32px] border-r-[32px] border-t-amber-400 border-r-transparent" />
                    <Pin size={11} className="absolute top-1 right-0.5 text-white -rotate-45" />
                </div>
            )}

            <div className="pl-5 pr-4 py-4 flex gap-4">
                {/* Icon bubble */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center mt-0.5`}>
                    <Icon size={16} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <User size={10} /> {note.author || 'Admin'}
                            </span>
                        </div>
                        {/* Actions — visible on hover */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionBtn
                                onClick={() => onPin(note.id)}
                                title={note.is_pinned ? 'Unpin' : 'Pin'}
                                className={note.is_pinned ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}
                            >
                                {note.is_pinned ? <PinOff size={14} /> : <Pin size={14} />}
                            </ActionBtn>
                            <ActionBtn onClick={() => onEdit(note)} title="Edit" className="text-indigo-500 hover:bg-indigo-50">
                                <Edit3 size={14} />
                            </ActionBtn>
                            <ActionBtn onClick={() => onDelete(note.id)} title="Delete" className="text-red-400 hover:bg-red-50">
                                <Trash2 size={14} />
                            </ActionBtn>
                        </div>
                    </div>

                    {/* Note text */}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{note.text}</p>

                    {/* Attached photo */}
                    {note.photo_url && (
                        <div className="mt-3">
                            <img
                                src={`${API_URL}${note.photo_url}`}
                                alt="Note attachment"
                                className="max-h-48 rounded-xl border border-gray-200 object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(`${API_URL}${note.photo_url}`, '_blank')}
                            />
                        </div>
                    )}

                    {/* Footer */}
                    <p className="text-[10px] text-gray-400 mt-2">{formatDate(note.created_at)}{note.updated_at !== note.created_at && ' · edited'}</p>
                </div>
            </div>
        </div>
    );
};

// Tiny icon button helper
const ActionBtn = ({ children, onClick, title, className = '' }) => (
    <button
        onClick={onClick}
        title={title}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${className}`}
    >
        {children}
    </button>
);

export default ViewStudentTimeline;