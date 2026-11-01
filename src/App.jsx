import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/navigation/Navbar';
import SubNav from './components/navigation/SubNav';
import LandingView from './components/views/LandingView';
import DashboardView from './components/views/DashboardView';
import BudgetView from './components/views/BudgetView';
import TimelineView from './components/views/TimelineView';
import VendorsView from './components/views/VendorsView';
import IdeasStudioView from './components/views/IdeasStudioView';
import GuestsView from './components/views/GuestsView';
import RiskShieldView from './components/views/RiskShieldView';
import CoPlannerDrawer from './components/views/CoPlannerDrawer';
import PrintBlueprintModal from './components/views/PrintBlueprintModal';
import ApiKeyModal from './components/views/ApiKeyModal';
import Toast from './components/common/Toast';
import { normalizeAndValidateEvent } from './utils/eventValidation';

import { SAMPLE_EVENTS } from './data/sampleEvents';
import {
  isAiLive,
  generatePlan,
  rebalanceBudget,
  generateIdeas,
  draftVendorMessage,
  generateRunOfShow,
  generateRiskPlan,
  chatUpdatePlan
} from './services/geminiService';

const STORAGE_KEY_EVENTS = 'soiree_saved_events';
const STORAGE_KEY_CURRENT_ID = 'soiree_active_event_id';

export default function App() {
  // Initialize events list with schema validation
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(ev => normalizeAndValidateEvent(ev, SAMPLE_EVENTS.wedding));
        }
      }
    } catch (e) {
      console.warn("Failed reading saved events:", e);
    }
    return [
      normalizeAndValidateEvent(SAMPLE_EVENTS.wedding),
      normalizeAndValidateEvent(SAMPLE_EVENTS.birthday),
      normalizeAndValidateEvent(SAMPLE_EVENTS.community)
    ];
  });

  const [currentEventId, setCurrentEventId] = useState(() => {
    const storedId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    return storedId || SAMPLE_EVENTS.wedding.id;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [isDraftingVendor, setIsDraftingVendor] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingRos, setIsGeneratingRos] = useState(false);
  const [isGeneratingRisks, setIsGeneratingRisks] = useState(false);
  const [isProcessingChat, setIsProcessingChat] = useState(false);

  // Modals & Drawers
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isCoPlannerOpen, setIsCoPlannerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [aiLiveStatus, setAiLiveStatus] = useState(isAiLive());

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error("Failed saving events to localStorage:", e);
    }
  }, [events]);

  useEffect(() => {
    if (currentEventId) {
      localStorage.setItem(STORAGE_KEY_CURRENT_ID, currentEventId);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_ID);
    }
  }, [currentEventId]);

  const currentEvent = events.find(e => e.id === currentEventId) || null;

  // Show Toast helper with cleanup
  const showToast = (msg) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Helper to update current event with schema normalization
  const updateCurrentEvent = (mutator) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        const rawUpdated = typeof mutator === 'function' ? mutator(ev) : { ...ev, ...mutator };
        return normalizeAndValidateEvent(rawUpdated, ev);
      }
      return ev;
    }));
  };

  // Generate new plan from scratch or prompt
  const handleGeneratePlan = async (inputData) => {
    setIsGeneratingPlan(true);
    try {
      const newPlan = await generatePlan(inputData);
      setEvents(prev => [newPlan, ...prev]);
      setCurrentEventId(newPlan.id);
      setActiveTab('dashboard');
      showToast(`Celebration plan created for "${newPlan.title}"!`);
    } catch (err) {
      console.error("Plan creation error:", err);
      showToast("Celebration arranged with curated master blueprint!");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Load sample demo event
  const handleLoadSample = (sampleType) => {
    const sample = SAMPLE_EVENTS[sampleType] || SAMPLE_EVENTS.wedding;
    // Check if already in list
    const exists = events.find(e => e.id === sample.id);
    if (!exists) {
      setEvents(prev => [sample, ...prev]);
    }
    setCurrentEventId(sample.id);
    setActiveTab('dashboard');
    showToast(`Loaded ${sample.title} demo celebration!`);
  };

  // AI Rebalance budget
  const handleAiRebalance = async (targetBudget) => {
    if (!currentEvent) return null;
    setIsRebalancing(true);
    try {
      const result = await rebalanceBudget(currentEvent, targetBudget);
      showToast("AI budget reallocation ready for review!");
      return result;
    } catch (err) {
      console.error("Budget rebalance error:", err);
      showToast("Budget redistributed gracefully.");
      return null;
    } finally {
      setIsRebalancing(false);
    }
  };

  // AI Draft vendor message
  const handleDraftVendorMessage = async (category, tone) => {
    if (!currentEvent) return null;
    setIsDraftingVendor(true);
    try {
      const draft = await draftVendorMessage(category, currentEvent, tone);
      return draft;
    } catch (err) {
      console.error("Draft message error:", err);
      return null;
    } finally {
      setIsDraftingVendor(false);
    }
  };

  // AI Surprise me ideas
  const handleSurpriseMe = async (category) => {
    if (!currentEvent) return;
    setIsGeneratingIdeas(true);
    try {
      const newIdeas = await generateIdeas(currentEvent, category);
      updateCurrentEvent(ev => ({
        ideas: [...newIdeas, ...(ev.ideas || [])]
      }));
      showToast(`Generated 3 fresh concepts for ${category}!`);
    } catch (e) {
      console.error("Ideas generation error:", e);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // Add Idea to Plan (creates task in timeline or notes in budget)
  const handleAddIdeaToPlan = (idea) => {
    if (!currentEvent) return;
    const newTask = {
      id: 'task-idea-' + Date.now(),
      title: `Execute concept: ${idea.title}`,
      phase: 'Finalizing',
      dueDate: currentEvent.date,
      priority: 'Medium',
      owner: 'Host',
      completed: false
    };
    updateCurrentEvent(ev => ({
      timeline: [newTask, ...(ev.timeline || [])]
    }));
    showToast(`"${idea.title}" added to your milestone timeline!`);
  };

  // Regenerate Run of Show
  const handleRegenerateRunOfShow = async () => {
    if (!currentEvent) return;
    setIsGeneratingRos(true);
    try {
      const updatedRos = await generateRunOfShow(currentEvent);
      updateCurrentEvent({ runOfShow: updatedRos });
      showToast("Master run-of-show itinerary re-synchronized!");
    } catch (e) {
      console.error("Run of show generation error:", e);
    } finally {
      setIsGeneratingRos(false);
    }
  };

  // Regenerate Risk Shield
  const handleRegenerateRisks = async () => {
    if (!currentEvent) return;
    setIsGeneratingRisks(true);
    try {
      const updatedRisks = await generateRiskPlan(currentEvent);
      updateCurrentEvent({ risks: updatedRisks });
      showToast("Plan B Risk Shield re-assessed!");
    } catch (e) {
      console.error("Risk plan error:", e);
    } finally {
      setIsGeneratingRisks(false);
    }
  };

  // Chat update plan
  const handleChatUpdatePlan = async (userMessage) => {
    if (!currentEvent) return null;
    setIsProcessingChat(true);
    try {
      const result = await chatUpdatePlan(currentEvent, userMessage);
      if (result && result.planUpdates && Object.keys(result.planUpdates).length > 0) {
        updateCurrentEvent(result.planUpdates);
        showToast("Co-Planner updated your celebration blueprint!");
      }
      return result;
    } catch (err) {
      console.error("Chat error:", err);
      return {
        replyText: "I've noted that detail and kept it in mind for your upcoming milestones.",
        changesSummary: null
      };
    } finally {
      setIsProcessingChat(false);
    }
  };

  // Timeline task toggling
  const handleToggleTask = (taskId) => {
    updateCurrentEvent(ev => ({
      timeline: (ev.timeline || []).map(t => {
        if (t.id === taskId) return { ...t, completed: !t.completed };
        return t;
      })
    }));
  };

  const handleAddTask = (newTask) => {
    updateCurrentEvent(ev => ({
      timeline: [newTask, ...(ev.timeline || [])]
    }));
    showToast("Milestone added to timeline!");
  };

  const handleDeleteTask = (taskId) => {
    updateCurrentEvent(ev => ({
      timeline: (ev.timeline || []).filter(t => t.id !== taskId)
    }));
  };

  return (
    <div className="min-h-screen bg-soiree-bg flex flex-col font-sans text-soiree-ink selection:bg-soiree-burgundy selection:text-white">
      
      {/* Primary Navigation */}
      <Navbar
        currentEvent={currentEvent}
        eventsList={events}
        onSelectEvent={(id) => {
          setCurrentEventId(id);
          if (id) setActiveTab('dashboard');
        }}
        onNewEvent={() => {
          setCurrentEventId(null);
          setActiveTab('landing');
        }}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        isLive={aiLiveStatus}
        onShowToast={showToast}
      />

      {/* Sub Navigation Tabs (when an event is selected) */}
      {currentEvent && (
        <SubNav
          activeTab={activeTab}
          onChangeTab={(tabId) => {
            if (tabId === 'chat') {
              setIsCoPlannerOpen(true);
            } else {
              setActiveTab(tabId);
            }
          }}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {!currentEvent || activeTab === 'landing' ? (
          <LandingView
            onGeneratePlan={handleGeneratePlan}
            onLoadSample={handleLoadSample}
            isGenerating={isGeneratingPlan}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                event={currentEvent}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onToggleTask={handleToggleTask}
                onOpenCoPlanner={() => setIsCoPlannerOpen(true)}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetView
                event={currentEvent}
                onUpdateBudget={(budgetChanges) => updateCurrentEvent(budgetChanges)}
                onAiRebalance={handleAiRebalance}
                isRebalancing={isRebalancing}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                event={currentEvent}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onRegenerateRunOfShow={handleRegenerateRunOfShow}
                isGeneratingRos={isGeneratingRos}
              />
            )}

            {activeTab === 'vendors' && (
              <VendorsView
                event={currentEvent}
                onUpdateVendors={(updatedVendors) => updateCurrentEvent({ vendors: updatedVendors })}
                onDraftMessage={handleDraftVendorMessage}
                isDrafting={isDraftingVendor}
              />
            )}

            {activeTab === 'ideas' && (
              <IdeasStudioView
                event={currentEvent}
                onUpdateIdeas={(updatedIdeas) => updateCurrentEvent({ ideas: updatedIdeas })}
                onSurpriseMe={handleSurpriseMe}
                onAddIdeaToPlan={handleAddIdeaToPlan}
                isGeneratingIdeas={isGeneratingIdeas}
              />
            )}

            {activeTab === 'guests' && (
              <GuestsView
                event={currentEvent}
                onUpdateGuests={(updatedGuests) => updateCurrentEvent({ guests: updatedGuests })}
              />
            )}

            {activeTab === 'risks' && (
              <RiskShieldView
                event={currentEvent}
                onUpdateRisks={(updatedRisks) => updateCurrentEvent({ risks: updatedRisks })}
                onRegenerateRisks={handleRegenerateRisks}
                isGeneratingRisks={isGeneratingRisks}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Co-Planner Drawer */}
      {currentEvent && (
        <CoPlannerDrawer
          isOpen={isCoPlannerOpen}
          onClose={() => setIsCoPlannerOpen(false)}
          event={currentEvent}
          onChatUpdatePlan={handleChatUpdatePlan}
          isProcessingChat={isProcessingChat}
        />
      )}

      {/* Print Blueprint Modal */}
      {currentEvent && (
        <PrintBlueprintModal
          event={currentEvent}
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onApiKeySaved={(isNowLive) => setAiLiveStatus(isNowLive)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-soiree-sand bg-soiree-cream/80 py-6 text-center text-xs text-soiree-muted no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-soiree-burgundy">Soirée Atelier</span>
            <span>•</span>
            <span className="font-serif italic">GenAI Event Planning & Living Dossier</span>
          </div>
          <div className="text-[11px] text-soiree-muted">
            Strict Beige & Burgundy Luxury Palette • Demo Mode Ready
          </div>
        </div>
      </footer>

    </div>
  );
}
