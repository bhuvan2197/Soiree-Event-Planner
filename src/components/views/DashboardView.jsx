import React, { useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Users,
  Store,
  DollarSign,
  ArrowRight,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import Badge from '../common/Badge';
import { calculateDaysRemaining, calculateReadinessScore } from '../../utils/eventValidation';

export default function DashboardView({
  event,
  onNavigateTab,
  onToggleTask,
  onOpenCoPlanner
}) {
  if (!event) return null;

  // Centralized calculations
  const daysLeft = useMemo(() => calculateDaysRemaining(event.date), [event.date]);
  const readiness = useMemo(() => calculateReadinessScore(event), [event]);

  // Derived metrics with useMemo
  const metrics = useMemo(() => {
    const totalTasks = event.timeline?.length || 0;
    const completedTasks = event.timeline?.filter(t => t.completed).length || 0;
    const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalVendors = event.vendors?.reduce((acc, cat) => acc + (cat.vendors?.length || 0), 0) || 0;
    const bookedVendors = event.vendors?.reduce((acc, cat) => {
      return acc + (cat.vendors?.filter(v => {
        const s = (v.status || '').toLowerCase();
        return s === 'booked' || s === 'paid' || s === 'contracted';
      }).length || 0);
    }, 0) || 0;

    const confirmedGuests = event.guests?.filter(g => g.status === 'Confirmed').reduce((acc, g) => acc + (Number(g.partySize) || 1), 0) || 0;

    const totalSpent = event.budget?.categories?.reduce((acc, c) => acc + (Number(c.actual) || 0), 0) || 0;
    const budgetRatio = event.totalBudget > 0 ? Math.min(100, Math.round((totalSpent / event.totalBudget) * 100)) : 0;

    // Next 3 tasks to do (uncompleted, prioritized)
    const nextThreeTasks = (event.timeline || [])
      .filter(t => !t.completed)
      .sort((a, b) => {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      })
      .slice(0, 3);

    return {
      totalTasks,
      completedTasks,
      taskPercent,
      totalVendors,
      bookedVendors,
      confirmedGuests,
      totalSpent,
      budgetRatio,
      nextThreeTasks
    };
  }, [event.timeline, event.vendors, event.guests, event.budget, event.totalBudget]);

  const {
    totalTasks,
    completedTasks,
    taskPercent,
    totalVendors,
    bookedVendors,
    confirmedGuests,
    totalSpent,
    budgetRatio,
    nextThreeTasks
  } = metrics;

  // SVG Ring calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Hero Banner with Countdown & Readiness */}
      <div className="bg-gradient-to-br from-soiree-cream via-soiree-cream to-soiree-sandLight rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury relative overflow-hidden">
        
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-soiree-gold/30 via-soiree-burgundy to-soiree-gold/30" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left Details */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="burgundy" size="xs">
                {event.eventType}
              </Badge>
              {(event.vibe || []).map(v => (
                <Badge key={v} variant="sand" size="xs">
                  {v}
                </Badge>
              ))}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-soiree-burgundyDeep leading-tight">
              {event.title}
            </h1>
            
            <p className="font-sans text-soiree-muted text-sm sm:text-base italic leading-relaxed">
              "{event.tagline || 'An extraordinary celebration envisioned down to every fine detail.'}"
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-soiree-ink font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-soiree-rose" />
                {event.date}
              </span>
              <span className="text-soiree-sand">•</span>
              <span>{event.city}</span>
              <span className="text-soiree-sand">•</span>
              <span className="text-soiree-muted">{event.guestCount} Planned Guests</span>
            </div>
          </div>

          {/* Right: Dual Badges (Countdown & Readiness Ring) */}
          <div className="flex items-center gap-5 sm:gap-8 self-center lg:self-auto bg-soiree-bg/80 border border-soiree-sand/80 px-6 py-4 rounded-2xl shadow-inner-soft">
            
            {/* Days Countdown */}
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-soiree-burgundy">
                {daysLeft}
              </div>
              <div className="text-[11px] font-sans uppercase tracking-widest text-soiree-muted font-semibold mt-0.5">
                Days to Go
              </div>
            </div>

            <div className="w-px h-12 bg-soiree-sand" />

            {/* Circular Readiness Ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-90"
                  role="img"
                  aria-label={`Celebration readiness: ${readiness}%`}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#E3D5BF"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#6D1A2B"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                    {readiness}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-soiree-burgundyDeep block">
                  Readiness Score
                </span>
                <span className="text-[11px] text-soiree-muted">
                  {readiness > 70 ? 'On Golden Track ✨' : 'Actions Pending'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Budget Card */}
        <button 
          type="button"
          onClick={() => onNavigateTab('budget')}
          className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 hover:border-soiree-burgundy/40 cursor-pointer transition-all hover:shadow-luxury group text-left"
          aria-label={`Committed budget: ${event.currencySymbol}${totalSpent.toLocaleString()} of ${event.currencySymbol}${event.totalBudget.toLocaleString()}. Open budget view.`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-soiree-muted">
              Committed Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-soiree-rose/10 flex items-center justify-center text-soiree-burgundy" aria-hidden="true">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {event.currencySymbol}{totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-soiree-muted mt-1">
            of {event.currencySymbol}{event.totalBudget.toLocaleString()} total target
          </p>
          <div className="w-full h-1.5 bg-soiree-sand rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalSpent > event.totalBudget ? 'bg-soiree-rose' : 'bg-soiree-burgundy'
              }`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>
        </button>

        {/* Tasks Done Card */}
        <button 
          type="button"
          onClick={() => onNavigateTab('timeline')}
          className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 hover:border-soiree-burgundy/40 cursor-pointer transition-all hover:shadow-luxury group text-left"
          aria-label={`Milestones: ${completedTasks} of ${totalTasks} done (${taskPercent}%). Open timeline view.`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-soiree-muted">
              Milestones Done
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-800/10 flex items-center justify-center text-emerald-800" aria-hidden="true">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {completedTasks} / {totalTasks}
          </div>
          <p className="text-xs text-soiree-muted mt-1">
            {taskPercent}% backward timeline completed
          </p>
          <div className="w-full h-1.5 bg-soiree-sand rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-700 transition-all duration-500"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </button>

        {/* Vendors Booked Card */}
        <button 
          type="button"
          onClick={() => onNavigateTab('vendors')}
          className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 hover:border-soiree-burgundy/40 cursor-pointer transition-all hover:shadow-luxury group text-left"
          aria-label={`${bookedVendors} vendors booked across ${event.vendors?.length || 0} categories. Open vendor view.`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-soiree-muted">
              Vendors Booked
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-700/10 flex items-center justify-center text-amber-800" aria-hidden="true">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {bookedVendors} Booked
          </div>
          <p className="text-xs text-soiree-muted mt-1">
            across {event.vendors?.length || 0} essential categories
          </p>
          <div className="flex items-center gap-1 text-[11px] text-soiree-rose font-medium mt-3">
            <span>Inquiry drafts ready</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </div>
        </button>

        {/* Guests Confirmed Card */}
        <button 
          type="button"
          onClick={() => onNavigateTab('guests')}
          className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 hover:border-soiree-burgundy/40 cursor-pointer transition-all hover:shadow-luxury group text-left"
          aria-label={`${confirmedGuests} guests confirmed of ${event.guestCount} planned. Open guest view.`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-soiree-muted">
              Guests Confirmed
            </span>
            <div className="w-8 h-8 rounded-xl bg-soiree-gold/15 flex items-center justify-center text-soiree-burgundyDeep" aria-hidden="true">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {confirmedGuests} Attending
          </div>
          <p className="text-xs text-soiree-muted mt-1">
            Targeting {event.guestCount} total party count
          </p>
          <div className="flex items-center gap-1 text-[11px] text-soiree-burgundy font-medium mt-3">
            <span>Manage dietary &amp; RSVPs</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </div>
        </button>

      </div>

      {/* Bottom Section: "Next 3 things to do" & Co-Planner Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next 3 Things To Do List */}
        <div className="lg:col-span-2 bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-soiree-burgundyDeep flex items-center gap-2">
                <Flame className="w-5 h-5 text-soiree-rose" /> Next Priority Actions
              </h2>
              <p className="text-xs text-soiree-muted mt-0.5">
                Hand-picked by the Soirée engine to maintain your celebration momentum.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs font-semibold text-soiree-burgundy hover:underline flex items-center gap-1"
            >
              Full Timeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {nextThreeTasks.length === 0 ? (
              <div className="text-center py-8 text-soiree-muted text-sm italic">
                🎉 All current milestones completed! Head to the timeline to add more.
              </div>
            ) : (
              nextThreeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-soiree-sand bg-soiree-bg/50 hover:bg-soiree-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="w-5 h-5 rounded-md border border-soiree-burgundy/40 flex items-center justify-center hover:bg-soiree-burgundy/10 transition-colors"
                      aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                      aria-pressed={task.completed}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 text-soiree-burgundy" aria-hidden="true" />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-soiree-ink leading-snug">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-soiree-muted mt-0.5">
                        <span className="font-semibold text-soiree-burgundyDeep">Phase: {task.phase}</span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                        <span>•</span>
                        <span>Owner: {task.owner}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={task.priority === 'High' ? 'rose' : 'sand'}
                    size="xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Co-Planner Teaser Card */}
        <div className="bg-gradient-to-br from-soiree-burgundy to-soiree-burgundyDeep text-[#FAF5EC] rounded-3xl p-6 shadow-luxury flex flex-col justify-between relative overflow-hidden">
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-serif text-soiree-gold font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Living Co-Planner</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-white leading-tight">
              Refine your plan with conversation.
            </h3>
            
            <p className="text-xs text-[#FAF5EC]/80 leading-relaxed font-sans">
              Want to cut 10% from decor? Add an afterparty? Make the menu gluten-free? Your AI Co-Planner adjusts the budget, timeline, and vendors dynamically.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={onOpenCoPlanner}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-soiree-cream text-soiree-burgundy font-serif font-bold text-sm shadow hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch AI Co-Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Background subtle watermark seal */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 pointer-events-none">
            <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center font-serif text-8xl font-bold">
              S
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
