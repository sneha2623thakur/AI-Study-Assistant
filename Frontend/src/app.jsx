import React, { useState, useEffect, useRef } from 'react';

const SUBJECT_ICONS = {
  Mathematics: '📐',
  Physics: '⚛️',
  Biology: '🔬',
  Geology: '⛰️',
  Psychology: '🧠',
  Anatomy: '🧬',
  Astronomy: '🌌',
  Geography: '🌍',
  ComputerScience: '🖥️',
  Sociology: '👥',
  Statistics: '📊',
  Science: '🔭',
  Hindi: '📝',
  Marathi: '📝',
  English: '📚',
  Chemistry: '🧪',
  Literature: '📖',
  History: '🏛️',
  Programming: '💻',

};

// Helper function to render clean HTML from AI markdown text across all corners
const formatAIResponse = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return lines.map((line, idx) => {
    // Headings (### )
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="font-extrabold text-base mt-4 mb-2 tracking-wide flex items-center gap-2">
          {line.replace('### ', '')}
        </h4>
      );
    }
    // Bullet points (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      return (
        <li key={idx} className="ml-5 list-disc my-1 leading-relaxed">
          {parseBoldText(content)}
        </li>
      );
    }
    // Regular text paragraphs
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="my-1.5 leading-relaxed">
        {parseBoldText(line)}
      </p>
    );
  });
};

// Sub-helper to handle **bold** text inside paragraphs/bullets
const parseBoldText = (str) => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function App() {
  const [page, setPage] = useState('welcome'); // 'welcome' | 'student' | 'teacher' | 'parent' | 'info' | 'tips'

  // Student Corner States
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome to the Student Corner! Let us explore ideas and conquer your coursework together.' }
  ]);
  const [input, setInput] = useState('');
  const [grade, setGrade] = useState('10th Grade');
  const [subject, setSubject] = useState('Mathematics');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Teacher Corner States
  const [teacherQuery, setTeacherQuery] = useState('');
  const [teacherGoal, setTeacherGoal] = useState('Fact Verification');
  const [teacherResult, setTeacherResult] = useState('');
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Parent Corner States
  const [projectTopic, setProjectTopic] = useState('');
  const [childGrade, setChildGrade] = useState('8th Grade');
  const [projectGuide, setProjectGuide] = useState('');
  const [projectLoading, setProjectLoading] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (page === 'student') scrollToBottom();
  }, [messages, loading, page]);

  const sendStudentMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, grade, subject }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Connection error: Make sure FastAPI backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherAction = async (e) => {
    e.preventDefault();
    if (!teacherQuery.trim() || teacherLoading) return;

    setTeacherLoading(true);
    setTeacherResult('');

    try {
      const prompt = `[TEACHER MODE - Goal: ${teacherGoal}] Topic/Query: ${teacherQuery}. Provide an expert, detailed academic breakdown, fact verification, or classroom example suited for educators. Format with clear headings and bullet points.`;
      
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, grade: 'Professional Educator', subject: 'Pedagogy' }),
      });
      const data = await response.json();
      setTeacherResult(data.reply);
    } catch (error) {
      setTeacherResult('⚠️ Connection error with backend server.');
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleParentAction = async (e) => {
    e.preventDefault();
    if (!projectTopic.trim() || projectLoading) return;

    setProjectLoading(true);
    setProjectGuide('');

    try {
      const prompt = `[PARENT PROJECT GUIDE MODE] My child is in ${childGrade}. They are working on a project about: "${projectTopic}". Provide a parent-friendly step-by-step guide explaining how I can mentor them, materials needed, timeline suggestions, and how to make learning fun without doing the work for them. Format with clear headings and bullet points.`;

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, grade: childGrade, subject: 'School Project Mentorship' }),
      });
      const data = await response.json();
      setProjectGuide(data.reply);
    } catch (error) {
      setProjectGuide('⚠️ Connection error with backend server.');
    } finally {
      setProjectLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden select-none bg-gradient-to-br from-sky-100 via-pink-50 to-sky-200 text-slate-800">
      
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-sky-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('welcome')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-pink-500 flex items-center justify-center text-lg shadow-md shadow-pink-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <span className="font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-pink-600">
            AI TUTOR SUITE
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setPage('welcome')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'welcome' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Welcome
          </button>
          <button 
            onClick={() => setPage('student')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'student' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Student Corner
          </button>
          <button 
            onClick={() => setPage('teacher')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'teacher' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Teacher Corner
          </button>
          <button 
            onClick={() => setPage('parent')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'parent' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Parent Corner
          </button>
          <button 
            onClick={() => setPage('info')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'info' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Info Hub
          </button>
          <button 
            onClick={() => setPage('tips')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${page === 'tips' ? 'bg-gradient-to-r from-sky-400 to-pink-400 text-white shadow-sky-200' : 'bg-white/60 text-slate-600 hover:bg-white'}`}
          >
            Study Tips
          </button>
        </div>
      </nav>

      {/* PAGE 1: WELCOME PAGE */}
      {page === 'welcome' && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center relative">
          <div className="max-w-3xl space-y-6 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-sky-200 shadow-xl shadow-sky-100">
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-pink-500 flex items-center justify-center shadow-lg text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                AI TUTOR SUITE
              </h1>
            </div>
            
            <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto">
              Your multi-functional educational ecosystem powered by dual-tone interactive design. Choose a section below to get started.
            </p>

            {/* Main Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div 
                onClick={() => setPage('student')} 
                className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 hover:border-sky-400 cursor-pointer transition group shadow-md"
              >
                <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <h3 className="font-extrabold text-sky-900 text-sm group-hover:text-sky-600 transition">Student Corner</h3>
                <p className="text-[11px] text-slate-500 mt-1">Idea brainstorming & step-by-step learning.</p>
              </div>

              <div 
                onClick={() => setPage('teacher')} 
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-pink-500 cursor-pointer transition group shadow-md text-white"
              >
                <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-pink-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="font-extrabold text-pink-300 text-sm group-hover:text-pink-400 transition">Teacher Corner</h3>
                <p className="text-[11px] text-slate-300 mt-1">Blackboard workspace for fact checking.</p>
              </div>

              <div 
                onClick={() => setPage('parent')} 
                className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-200 hover:border-pink-400 cursor-pointer transition group shadow-md"
              >
                <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3.3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <h3 className="font-extrabold text-pink-900 text-sm group-hover:text-pink-600 transition">Parent Corner</h3>
                <p className="text-[11px] text-slate-500 mt-1">Project guides & home mentorship.</p>
              </div>
            </div>

            {/* Middle: Explore Info Hub & Explore Study Tips Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-sky-200/60 text-xs">
              <button 
                onClick={() => setPage('info')}
                className="p-3 bg-sky-50/70 hover:bg-sky-100 rounded-xl border border-sky-100 flex items-center justify-center gap-2 text-sky-800 font-semibold transition cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Explore Info Hub
              </button>
              <button 
                onClick={() => setPage('tips')}
                className="p-3 bg-pink-50/70 hover:bg-pink-100 rounded-xl border border-pink-100 flex items-center justify-center gap-2 text-pink-800 font-semibold transition cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Explore Study Tips
              </button>
            </div>

            {/* Quick Prompt Tips Banner at the End */}
            <div className="bg-sky-50/80 border border-sky-200/60 rounded-2xl p-4 text-left shadow-sm">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span>💡</span> Prompting Tips for Best Results
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <li className="bg-white/60 p-2 rounded-xl border border-sky-100">
                  <span className="font-bold text-sky-800 block mb-0.5">🎓 Student Corner</span>
                  Be specific with your topic or ask for step-by-step breakdowns (e.g., "Explain quantum computing simply").
                </li>
                <li className="bg-slate-900/5 p-2 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-slate-800 block mb-0.5">👩‍🏫 Teacher Corner</span>
                  Include your target grade level and learning objectives for precise lesson plans or fact checks.
                </li>
                <li className="bg-pink-50/60 p-2 rounded-xl border border-pink-100">
                  <span className="font-bold text-pink-900 block mb-0.5">👨‍👩‍👧 Parent Corner</span>
                  Mention available household materials or time limits when planning home projects.
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* EXTRA PAGE: INFO HUB (Dark Theme with Sneha's Avatar) */}
      {/* EXTRA PAGE: INFO HUB (Light Blue Theme with 3 Creator / */}
      {/* EXTRA PAGE: INFO HUB (Light Blue Theme with 3 Creator Avatars) */}
      {page === 'info' && (
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center bg-gradient-to-br from-sky-100 via-sky-50 to-pink-50 text-slate-800 relative">
          <div className="max-w-2xl w-full space-y-6 bg-white/90 backdrop-blur-md border border-sky-200 p-8 rounded-3xl shadow-xl shadow-sky-100 relative z-10">
            
            {/* Header & Creators */}
            <div className="flex items-center justify-between border-b border-sky-200 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-sky-900 flex items-center gap-2">
                  📖 App Info Hub
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Engineered by your development team</p>
              </div>
              <button 
                onClick={() => setPage('welcome')}
                className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Back Home
              </button>
            </div>

            {/* Creators Showcase */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-sky-400 to-pink-500 flex items-center justify-center text-white text-base shadow-md">👩‍💻</div>
                <h5 className="font-bold text-xs text-sky-900">Sneha</h5>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">1st Creator</span>
              </div>

               <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-base shadow-md">👦🏽</div>
                <h5 className="font-bold text-xs text-sky-900">Shivtej</h5>
                <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-semibold">Developer</span>
              </div>

              <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white text-base shadow-md">👧🏽</div>
                <h5 className="font-bold text-xs text-sky-900">Sanika</h5>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Developer</span>
              </div> 
            </div>

            {/* Info Body */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-200 space-y-2">
                <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider">About AI Tutor Suite</h4>
                <p className="text-xs text-slate-600">
                  AI Tutor Suite is a comprehensive educational ecosystem built collaboratively by Sneha, Shivtej, and Sanika to enhance learning through interactive AI guidance.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider">Core Features</h4>
                <ul className="space-y-2 text-xs">
                  <li className="bg-white p-3 rounded-xl border border-sky-200 flex items-start gap-3 shadow-sm">
                    <span className="text-sky-600 font-bold">✨ Student Corner:</span> 
                    <span>An interactive workspace for brainstorming ideas and simplifying coursework.</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl border border-sky-200 flex items-start gap-3 shadow-sm">
                    <span className="text-pink-600 font-bold">📚 Teacher Corner:</span> 
                    <span>A blackboard workspace for educators to verify facts and generate classroom examples.</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl border border-sky-200 flex items-start gap-3 shadow-sm">
                    <span className="text-amber-600 font-bold">🏠 Parent Corner:</span> 
                    <span>Provides step-by-step project guides and home mentorship strategies.</span>
                  </li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => setPage('student')}
              className="w-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-xs shadow-lg shadow-sky-200 cursor-pointer"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      )}

      {/* EXTRA PAGE: STUDY TIPS (Light Blue Theme with 3 Creator Avatars) */}
      {page === 'tips' && (
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center bg-gradient-to-br from-sky-100 via-sky-50 to-pink-50 text-slate-800 relative">
          <div className="max-w-2xl w-full space-y-6 bg-white/90 backdrop-blur-md border border-sky-200 p-8 rounded-3xl shadow-xl shadow-sky-100 relative z-10">
            
            {/* Header & Creators */}
            <div className="flex items-center justify-between border-b border-sky-200 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-sky-900 flex items-center gap-2">
                  💡 Pro Study Techniques
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Curated by Sneha, Shivtej & Sanika</p>
              </div>
              <button 
                onClick={() => setPage('welcome')}
                className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Back Home
              </button>
            </div>

            {/* Creators Showcase */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-sky-400 to-pink-500 flex items-center justify-center text-white text-base shadow-md">👩‍💻</div>
                <h5 className="font-bold text-xs text-sky-900">Sneha</h5>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">1st Creator</span>
              </div>
               <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-base shadow-md">👦🏽</div>
                <h5 className="font-bold text-xs text-sky-900">Shivtej</h5>
                <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-semibold">Developer</span>
              </div>
              <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white text-base shadow-md">👧🏽</div>
                <h5 className="font-bold text-xs text-sky-900">Sanika</h5>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Developer</span>
              </div> 
            </div>

            {/* Tips Body */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-200 space-y-2">
                <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider">Optimize Your Retention</h4>
                <p className="text-xs text-slate-600">
                  Master your coursework efficiently using these proven methodologies recommended by our team:
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-1 shadow-sm">
                  <strong className="text-pink-700 text-xs font-bold block">🧠 Active Recall</strong>
                  <p className="text-[11px] text-slate-500 leading-normal">Test your knowledge actively through quizzes and flashcards rather than passively re-reading textbooks.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-1 shadow-sm">
                  <strong className="text-sky-700 text-xs font-bold block">🗣️ The Feynman Technique</strong>
                  <p className="text-[11px] text-slate-500 leading-normal">Break down complex topics into simple everyday language as if you are teaching it to a beginner.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-1 shadow-sm">
                  <strong className="text-emerald-700 text-xs font-bold block">⏱️ Pomodoro Sessions</strong>
                  <p className="text-[11px] text-slate-500 leading-normal">Maintain high mental focus by working in deep 25-minute intervals followed by brief 5-minute recovery breaks.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setPage('student')}
              className="w-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-xs shadow-lg shadow-sky-200 cursor-pointer"
            >
              Put Tips to Practice in Student Corner
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2: STUDENT CORNER */}
      {page === 'student' && (
        <div className="flex flex-col md:flex-row flex-1 overflow-x-hidden w-full max-w-full relative bg-gradient-to-br from-sky-200 via-sky-100 to-pink-100"> 
          <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center">
            <div className="text-[12rem] md:text-[16rem] font-black text-sky-500 tracking-widest select-none blur-sm">IDEAS</div>
          </div>

           <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-sky-200 bg-white/90 backdrop-blur-md p-6 flex flex-col justify-between z-10 shadow-lg">           
             <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-sky-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Student Idea Workspace
              </h2>
              <div>
                <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">Grade Level</label>
                <input 
                  type="text" 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)} 
                  className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-pink-400 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">Subject Area</label>
                <select 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-pink-400 cursor-pointer font-medium"
                >
                  {Object.keys(SUBJECT_ICONS).map((subj) => (
                    <option key={subj} value={subj}>{SUBJECT_ICONS[subj]} {subj}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-xs text-slate-700 shadow-sm">
              <span className="font-bold text-pink-600">Idea Spark:</span> Ask for creative real-world connections!
            </div>
          </aside>

          <main className="flex-1 flex flex-col h-full relative z-10">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="max-w-3xl mx-auto space-y-6 w-full">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-pink-500 flex items-center justify-center text-sm shadow-md text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                      </div>
                    )}
                    <div className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-none shadow-pink-200' : 'bg-white/90 border border-sky-200 text-slate-800 rounded-bl-none backdrop-blur-sm'}`}>
                      {msg.sender === 'ai' ? formatAIResponse(msg.text) : msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-pink-500 flex items-center justify-center text-sm text-white">💡</div>
                    <div className="bg-white/90 border border-sky-200 px-5 py-3 rounded-2xl text-slate-500 text-sm animate-pulse shadow-sm">Sparking ideas...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <footer className="p-6 bg-white/70 backdrop-blur-md border-t border-sky-200">
              <div className="max-w-3xl mx-auto space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['Explain like I am 5', 'Give me a 3-question quiz', 'Summarize key formulas'].map((pill, idx) => (
                    <button key={idx} onClick={() => sendStudentMessage(pill)} className="whitespace-nowrap text-xs bg-sky-100 hover:bg-sky-200 border border-sky-200 text-sky-800 font-semibold px-4 py-1.5 rounded-full transition shadow-sm cursor-pointer">
                      ✨ {pill}
                    </button>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendStudentMessage(); }} className="flex gap-3 relative items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Brainstorm anything about ${subject}...`}
                    className="flex-1 bg-white border border-sky-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-pink-400 shadow-sm"
                  />
                  <button type="submit" disabled={loading || !input.trim()} className="bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-md shadow-sky-200 cursor-pointer">
                    Send
                  </button>
                </form>
              </div>
            </footer>
          </main>
        </div>
      )}

      {/* PAGE 3: TEACHER CORNER */}
      {page === 'teacher' && (
// OLD (Dark Theme)
<div className="flex-1 overflow-y-auto p-8 flex flex-col items-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 text-slate-800 relative">
            <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-6 left-10 text-emerald-500/20 font-mono text-sm pointer-events-none select-none">
            E = mc² &nbsp;&nbsp; ∫ f(x)dx &nbsp;&nbsp; PV = nRT &nbsp;&nbsp; a² + b² = c²
          </div>

          <div className="max-w-3xl w-full space-y-6 relative z-10">
            <div>
              <h2 className="text-2xl font-extrabold text-darkgreen-300 flex items-center gap-2 drop-shadow-md">
                Teacher Blackboard Workspace
              </h2>
              <p className="text-xs text-navyblue-200 mt-1">Verify technical facts, generate lesson examples, and test pedagogies on a clean slate.</p>
            </div>

            <form onSubmit={handleTeacherAction} className="space-y-4 bg-[#182C25]/90 backdrop-blur-md border border-emerald-500/30 p-6 rounded-3xl shadow-2xl shadow-emerald-950/50">
              <div>
                <label className="text-xs font-bold text-pink-300 uppercase tracking-wider block mb-2">Teacher Goal</label>
                <select 
                  value={teacherGoal} 
                  onChange={(e) => setTeacherGoal(e.target.value)}
                  className="w-full bg-[#101E1A] border border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400 cursor-pointer font-medium"
                >
                  <option value="Fact Verification">Fact Verification & Accuracy Check</option>
                  <option value="Classroom Example Generation">Generate Real-World Classroom Examples</option>
                  <option value="Pedagogical Breakdown">Lesson Planning & Concept Breakdown</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-pink-300 uppercase tracking-wider block mb-2">Topic or Concept</label>
                <textarea 
                  rows="3"
                  value={teacherQuery} 
                  onChange={(e) => setTeacherQuery(e.target.value)}
                  placeholder="e.g., Explain quantum superposition simply for a high school physics class..."
                  className="w-full bg-[#101E1A] border border-emerald-500/40 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-pink-400 shadow-inner"
                />
              </div>

              <button 
                type="submit" 
                disabled={teacherLoading || !teacherQuery.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-sky-400 hover:opacity-90 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg shadow-pink-500/20 cursor-pointer"
              >
                {teacherLoading ? 'Analyzing Blackboard Data...' : 'Generate Educator Report'}
              </button>
            </form>

            {teacherResult && (
              <div className="p-6 rounded-3xl bg-[#182C25]/95 backdrop-blur-md border border-emerald-500/30 space-y-3 shadow-xl">
                <h3 className="text-xs font-extrabold text-pink-300 uppercase tracking-wider">Verified Educator Report</h3>
                
                {/* Fixed container: removed font-mono and matched text-sm font sizing */}
                <div className="text-sm text-slate-100 bg-[#101E1A]/80 p-5 rounded-2xl border border-emerald-500/20 space-y-1.5 leading-relaxed">
                  {formatAIResponse(teacherResult)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE 4: PARENT CORNER */}
      {page === 'parent' && (
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center relative bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 text-slate-800">
          
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:28px_28px]"></div>
          <div className="absolute top-8 right-12 text-rose-400/30 font-serif text-lg italic pointer-events-none select-none">
            🏠 Home Mentorship &nbsp;•&nbsp; 🌟 Family Collaboration &nbsp;•&nbsp; 📚 Growth
          </div>

          <div className="max-w-3xl w-full space-y-6 relative z-10">
            <div>
              <h2 className="text-2xl font-extrabold text-rose-900 flex items-center gap-2 drop-shadow-sm">
                Parent Project Mentorship Guide
              </h2>
              <p className="text-xs text-rose-700/80 mt-1 font-medium">Get custom project guidance, home supervision tips, and milestones to help your child excel.</p>
            </div>

            <form onSubmit={handleParentAction} className="space-y-4 bg-white/90 backdrop-blur-md border border-rose-200/80 p-6 rounded-3xl shadow-2xl shadow-rose-950/10">
              <div>
                <label className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2">Child Grade Level</label>
                <input 
                  type="text" 
                  value={childGrade} 
                  onChange={(e) => setChildGrade(e.target.value)} 
                  className="w-full bg-rose-50/60 border border-rose-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-400 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2">School Project Topic / Assignment</label>
                <textarea 
                  rows="3"
                  value={projectTopic} 
                  onChange={(e) => setProjectTopic(e.target.value)}
                  placeholder="e.g., Building a solar system model with household items, or a history presentation on the industrial revolution..."
                  className="w-full bg-rose-50/60 border border-rose-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:border-rose-400 shadow-inner"
                />
              </div>

              <button 
                type="submit" 
                disabled={projectLoading || !projectTopic.trim()}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                {projectLoading ? 'Designing Mentorship Plan...' : 'Generate Parent Project Guide'}
              </button>
            </form>

            {projectGuide && (
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-200/80 space-y-3 shadow-xl">
                <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">Parent Actionable Guide & Milestones</h3>
                <div className="text-sm text-slate-700 bg-rose-50/50 p-5 rounded-2xl border border-rose-100 space-y-1">
                  {formatAIResponse(projectGuide)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}