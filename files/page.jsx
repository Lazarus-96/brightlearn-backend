"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Link  from "next/link";
import { userAPI } from "@/lib/api";

const STATS = [
  { label: "Courses enrolled", value: "6",    sub: "2 in progress",     color: "text-primary",   bg: "bg-primary/10"   },
  { label: "Average grade",    value: "84%",  sub: "+3% this term",     color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Hours this week",  value: "12.5", sub: "Goal: 15 hrs",      color: "text-accent",    bg: "bg-sky-100"      },
  { label: "Attendance",       value: "96%",  sub: "1 absent",          color: "text-purple-500",bg: "bg-purple-100"   },
];

const RECENT = [
  { msg: "Assignment graded: 88/100",         time: "2 hours ago",   dot: "bg-secondary" },
  { msg: "New lesson uploaded in Physics",    time: "Yesterday",     dot: "bg-purple-400" },
  { msg: "Fee reminder: due in 7 days",       time: "2 days ago",    dot: "bg-slate-300" },
  { msg: "Quiz completed: Mathematics Ch. 7", time: "3 days ago",    dot: "bg-primary"   },
];

const COURSES = [
  { name: "Mathematics", chapter: "Ch.7 · Integration", pct: 72, color: "#FF6B35", bg: "bg-primary/10", text: "text-primary" },
  { name: "Physics",     chapter: "Ch.4 · Wave Mechanics",pct: 45, color: "#8338EC", bg: "bg-purple-100", text: "text-purple-600" },
  { name: "Chemistry",   chapter: "Ch.9 · Organic Reactions",pct: 89, color: "#06D6A0", bg: "bg-secondary/10", text: "text-emerald-700" },
];

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    userAPI.getProfile()
      .then(({ data }) => setProfile(data.user))
      .catch(() => {});
  }, []);

  const displayUser = profile || user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
          </svg>
          <p className="text-slate-500 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ───────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-navy border-r border-white/5 py-5 fixed top-0 left-0 bottom-0 z-40">
        <Link href="/" className="flex items-center gap-2.5 px-5 mb-8">
          <div className="w-8 h-8 bg-primary rounded-[9px] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 18 18"><polygon points="9,1.5 11,7 16.5,7 12,10.5 14,16 9,13 4,16 6,10.5 1.5,7 7,7" fill="white"/></svg>
          </div>
          <span className="font-display font-bold text-base text-white">BrightLearn</span>
        </Link>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {[
            { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard", active: true  },
            { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Courses",   active: false },
            { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", label: "Assignments",active: false },
            { icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z", label: "Progress",  active: false },
            { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", label: "Notifications",active: false },
          ].map((n) => (
            <button key={n.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                n.active ? "bg-primary/15 text-primary" : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={n.active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={n.icon}/>
              </svg>
              {n.label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 mt-auto">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {displayUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{displayUser?.name}</div>
              <div className="text-white/40 text-[10px] truncate">{displayUser?.email}</div>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 text-white/45 hover:text-white/80 hover:bg-white/5 rounded-xl text-sm transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-navy-800">
              {greeting}, {displayUser?.name?.split(" ")[0]}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full"/>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
              {displayUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <Button onClick={logout} variant="ghost" size="sm" className="hidden md:flex">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign out
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Profile card */}
          <div className="bg-navy rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-50" aria-hidden="true"/>
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl" aria-hidden="true"/>
            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0">
                {displayUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-xl font-bold text-white">{displayUser?.name}</h2>
                  <span className="bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full capitalize">{displayUser?.role}</span>
                </div>
                <p className="text-white/50 text-sm">{displayUser?.email}</p>
                <p className="text-white/30 text-xs mt-1">
                  Member since {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString("en-US", { month:"long", year:"numeric" }) : "—"}
                </p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-white text-sm font-semibold">2,340 XP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <span className="text-base">🔥</span>
                  <span className="text-white text-sm font-semibold">7-day streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-slate-400 mb-2">{s.label}</div>
                <div className={`text-3xl font-display font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Courses */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-navy-800">My courses</h3>
                <Link href="#" className="text-primary text-sm font-medium hover:underline">View all</Link>
              </div>
              <div className="flex flex-col gap-4">
                {COURSES.map((c) => (
                  <div key={c.name} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.text} font-bold text-sm flex-shrink-0`}>
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-800 mb-0.5">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.chapter}</div>
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{width:`${c.pct}%`,background:c.color}}/>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-navy-800 mb-4">Recent activity</h3>
              <div className="flex flex-col gap-0">
                {RECENT.map((a, i) => (
                  <div key={i} className={`flex items-start gap-3 py-3 ${i < RECENT.length - 1 ? "border-b border-slate-50" : ""}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`}/>
                    <div>
                      <p className="text-sm text-slate-700 leading-snug">{a.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Start Quiz",     icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "text-primary bg-primary/10" },
              { label: "Pay Fees",       icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",                               color: "text-secondary bg-secondary/10" },
              { label: "View Timetable", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                color: "text-accent bg-sky-100" },
              { label: "Ask Stella AI",  icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", color: "text-purple-500 bg-purple-100" },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-2 bg-white border border-slate-100 rounded-xl py-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={a.icon}/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-700">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
