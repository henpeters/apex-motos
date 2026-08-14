import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { getMessages, toggleMessageRead, deleteMessage } from '../services/api';
import { Message } from '../types';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const updated = await toggleMessageRead(id, !currentRead);
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete message entry?')) {
      try {
        await deleteMessage(id);
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          Customer <span className="text-brand-red">Inquiries Inbox</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Review contact form submissions, diagnostic inquiries, and parts questions.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="admin-card h-40 rounded-2xl animate-pulse" />
        ) : messages.length === 0 ? (
          <div className="admin-card p-12 text-center rounded-3xl border border-white/10 text-slate-400">
            No customer inquiries found in database.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`admin-card p-6 rounded-2xl border transition-all space-y-4 ${
                msg.read ? 'border-white/5 opacity-80' : 'border-brand-red/40 bg-brand-red/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.read)}
                    className="text-slate-400 hover:text-brand-red"
                    title={msg.read ? 'Mark Unread' : 'Mark Read'}
                  >
                    {msg.read ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-brand-red" />}
                  </button>
                  <div>
                    <h4 className="font-heading font-bold text-white text-base">{msg.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-1.5 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-1">
                  Subject: {msg.subject || 'General Inquiry'}
                </span>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
