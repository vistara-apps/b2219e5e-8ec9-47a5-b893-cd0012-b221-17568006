    'use client';

    import { useState } from 'react';

    export default function CampaignBriefForm({ onSubmit }) {
      const [form, setForm] = useState({ title: '', description: '', goals: '', audience: '' });

      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        setForm({ title: '', description: '', goals: '', audience: '' });
      };

      return (
        <form onSubmit={handleSubmit} className="bg-surface p-md rounded-lg shadow-card mb-lg">
          <h2 className="text-body font-bold mb-md">Create Campaign Brief</h2>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Campaign Title" className="w-full p-sm border rounded-sm mb-sm" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-sm border rounded-sm mb-sm" required />
          <input name="goals" value={form.goals} onChange={handleChange} placeholder="Goals" className="w-full p-sm border rounded-sm mb-sm" required />
          <input name="audience" value={form.audience} onChange={handleChange} placeholder="Target Audience" className="w-full p-sm border rounded-sm mb-sm" required />
          <button type="submit" className="bg-accent text-white px-md py-sm rounded-md">Submit Brief</button>
        </form>
      );
    }
  