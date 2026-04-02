import React, { useState, useEffect } from 'react';
import { API_URL } from './config';
import Sidebar from './Sidebar';
import { Book, Plus, Trash2, Edit3, X, Save, Clock, Menu, Search, Pin } from 'lucide-react';
import { useNotification } from './context/NotificationContext';

const colorThemes = [
    { name: 'white', bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-200' },
    { name: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' },
    { name: 'green', bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' },
    { name: 'blue', bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
    { name: 'pink', bg: 'bg-pink-50', text: 'text-pink-900', border: 'border-pink-200' },
    { name: 'purple', bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
];

const Notebook = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { notify } = useNotification();
    
    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '', color_theme: 'white', is_pinned: false });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/notes`);
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            } else {
                throw new Error('Failed to fetch notes');
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            notify("error", "Error fetching notes", "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = async () => {
        if (!currentNote.title.trim()) {
            notify("error", "Title cannot be empty", "Error");
            return;
        }

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_URL}/api/notes/${currentNote.id}` : `${API_URL}/api/notes`;
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentNote),
            });

            if (response.ok) {
                const updatedNote = await response.json();
                if (isEditing) {
                    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n).sort((a,b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || new Date(b.updated_at) - new Date(a.updated_at)));
                    notify("success", "Note updated successfully", "Success");
                } else {
                    setNotes(prev => [updatedNote, ...prev].sort((a,b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || new Date(b.updated_at) - new Date(a.updated_at)));
                    notify("success", "Note created successfully", "Success");
                }
                closeModal();
            } else {
                throw new Error('Failed to save note');
            }
        } catch (error) {
            console.error("Error saving note:", error);
            notify("error", "Error saving note", "Error");
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setNotes(notes.filter(n => n.id !== id));
                notify("success", "Note deleted successfully", "Success");
            } else {
                throw new Error('Failed to delete note');
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            notify("error", "Error deleting note", "Error");
        }
    };

    const togglePin = async (note) => {
        try {
            const response = await fetch(`${API_URL}/api/notes/${note.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...note, is_pinned: !note.is_pinned }),
            });

            if (response.ok) {
                const updatedNote = await response.json();
                setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n).sort((a,b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || new Date(b.updated_at) - new Date(a.updated_at)));
            } else {
                notify("error", "Failed to update pin status", "Error");
            }
        } catch (error) {
            console.error("Error pinning note:", error);
            notify("error", "Error updating pin", "Error");
        }
    };

    const openModalForNew = () => {
        setCurrentNote({ title: '', content: '', color_theme: 'white', is_pinned: false });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openModalForEdit = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentNote({ title: '', content: '', color_theme: 'white', is_pinned: false });
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
        
        let matchesDate = true;
        if (dateFilter) {
            const noteDate = new Date(note.updated_at);
            const yyyy = noteDate.getFullYear();
            const mm = String(noteDate.getMonth() + 1).padStart(2, '0');
            const dd = String(noteDate.getDate()).padStart(2, '0');
            const localDateStr = `${yyyy}-${mm}-${dd}`;
            matchesDate = localDateStr === dateFilter;
        }
        
        return matchesSearch && matchesDate;
    });

    const pinnedNotes = filteredNotes.filter(n => n.is_pinned);
    const unpinnedNotes = filteredNotes.filter(n => !n.is_pinned);

    const renderNoteCard = (note) => {
        const theme = colorThemes.find(t => t.name === note.color_theme) || colorThemes[0];
        return (
            <div 
                key={note.id} 
                className={`${theme.bg} ${theme.border} border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer`}
                onClick={() => openModalForEdit(note)}
            >
                <div className="p-5 flex-1 relative">
                    <div className={`absolute top-4 right-4 flex transition-opacity gap-2 ${note.is_pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); togglePin(note); }}
                            className={`p-1.5 rounded-lg shadow-sm transition-colors ${note.is_pinned ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500'}`}
                        >
                            <Pin size={16} className={note.is_pinned ? 'fill-current' : ''} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); openModalForEdit(note); }}
                            className="p-1.5 bg-white/80 hover:bg-white text-blue-600 rounded-lg shadow-sm transition-colors"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                            className="p-1.5 bg-white/80 hover:bg-white text-red-600 rounded-lg shadow-sm transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${theme.text} pr-24 line-clamp-2`}>
                        {note.title}
                    </h3>
                    <p className={`text-sm opacity-80 whitespace-pre-wrap line-clamp-6 ${theme.text}`}>
                        {note.content}
                    </p>
                </div>
                <div className={`px-5 py-3 border-t ${theme.border} flex items-center text-xs opacity-70`}>
                    <Clock size={12} className="mr-1.5" />
                    {formatDate(note.updated_at)}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0 min-h-screen`}>
                
                {/* Header Elements */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-10 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-500 hover:text-green-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="bg-green-100 p-2 rounded-xl">
                            <Book className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Note Book</h1>
                            <p className="text-sm text-gray-500 hidden md:block">Manage your personal and administrative notes</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-auto shrink-0 flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none w-full sm:w-64 text-sm"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative shrink-0 flex items-center">
                            <input 
                                type="date"
                                className="w-full sm:w-auto border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-600"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                title="Filter by date"
                            />
                            {dateFilter && (
                                <button 
                                    onClick={() => setDateFilter('')}
                                    className="absolute right-2 text-gray-400 hover:text-red-500 bg-white"
                                    title="Clear date"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={openModalForNew}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 font-medium shrink-0"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">New Note</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="p-4 md:p-8 flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
                            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                                <Book size={40} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Notebook is Empty</h3>
                            <p className="text-gray-500 max-w-md">Create your first note to keep track of important administrative tasks, ideas, or reminders.</p>
                            <button onClick={openModalForNew} className="mt-6 text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
                                <Plus size={18} /> Add Your First Note
                            </button>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
                            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                                <Search size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
                            <p className="text-gray-500 max-w-md">We couldn't find any notes matching your search or date filter.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {pinnedNotes.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Pin size={16} /> Pinned Notes
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {pinnedNotes.map(renderNoteCard)}
                                    </div>
                                </div>
                            )}

                            {unpinnedNotes.length > 0 && (
                                <div>
                                    {pinnedNotes.length > 0 && (
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Book size={16} /> Other Notes
                                        </h2>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {unpinnedNotes.map(renderNoteCard)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Note Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between p-4 md:p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Note' : 'Create New Note'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-100 hover:bg-red-50 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-3 bg-gray-50/50"
                                    placeholder="Enter note title..."
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={currentNote.content}
                                    onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-green-500 focus:ring-green-500 min-h-[250px] px-4 py-3 bg-gray-50/50 resize-y"
                                    placeholder="Write your note here..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                                <div className="flex flex-wrap gap-3">
                                    {colorThemes.map(theme => (
                                        <button
                                            key={theme.name}
                                            onClick={() => setCurrentNote({...currentNote, color_theme: theme.name})}
                                            className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 border-2 
                                                ${theme.bg} 
                                                ${currentNote.color_theme === theme.name ? 'border-green-600 scale-110 shadow-md ring-2 ring-green-100 ring-offset-1' : theme.border + ' hover:scale-105'}
                                            `}
                                            title={`Theme: ${theme.name}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-xl transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow"
                            >
                                <Save size={18} />
                                {isEditing ? 'Update Note' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notebook;
