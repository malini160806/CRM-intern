import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  DollarSign,
  Clock,
  TrendingUp,
  Building2,
  Calendar,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AddDealModal from '../components/AddDealModal';
import DealProbabilityModal from '../components/DealProbabilityModal';

const STAGES = [
  { id: 'New', title: 'New Deal', color: 'bg-blue-500' },
  { id: 'Qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'Proposal Sent', title: 'Proposal', color: 'bg-amber-500' },
  { id: 'Negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'Won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'Lost', title: 'Closed Lost', color: 'bg-red-500' }
];

const SortableDealCard = ({ deal, onProbabilityClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 dark:bg-slate-800 dark:border-slate-700 group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${deal.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
          }`}>
          {deal.priority}
        </span>
        <button className="text-slate-300 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-sm font-bold text-slate-900 mb-1 dark:text-white group-hover:text-primary-600">
        {deal.title}
      </h4>
      <p className="text-xs text-slate-500 mb-3 flex items-center">
        <Building2 className="w-3 h-3 mr-1" />
        {deal.company}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
        <div className="flex items-center text-primary-600 font-black text-sm">
          <DollarSign className="w-3.5 h-3.5" />
          {deal.value.toLocaleString()}
        </div>
        
        {/* Win Probability Badge */}
        <div 
          onClick={(e) => { e.stopPropagation(); onProbabilityClick(deal); }}
          className={`flex items-center text-[10px] px-2 py-1 font-bold rounded cursor-pointer transition-colors ${
            (deal.probability || 85) >= 70 ? 'bg-green-100 text-green-700 hover:bg-green-200' :
            (deal.probability || 85) >= 40 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
            'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {deal.probability || 85}% Win
        </div>

        <div className="flex items-center text-[10px] text-slate-400 font-bold hidden sm:flex">
          <Calendar className="w-3 h-3 mr-1" />
          {deal.date}
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, deals, onProbabilityClick }) => {
  const { setNodeRef } = useSortable({ id: stage.id });

  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-slate-50/50 rounded-2xl p-4 dark:bg-slate-900/50">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">{stage.title}</h3>
          <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-md text-slate-500 font-black dark:bg-slate-800">
            {deals.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-primary-600">
            ${deals.reduce((acc, d) => acc + d.value, 0).toLocaleString()}
          </span>
          <Plus className="w-4 h-4 text-slate-400 hover:text-primary-600 cursor-pointer" />
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} onProbabilityClick={onProbabilityClick} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drop Here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProbabilityDeal, setActiveProbabilityDeal] = useState(null);

  const fetchDeals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/deals', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Ensure each deal has a string 'id' for dnd-kit
      const processedDeals = response.data.map(d => ({ ...d, id: d._id }));
      setDeals(processedDeals);
    } catch (err) {
      console.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealAdded = (newDeal) => {
    setDeals(prev => [{ ...newDeal, id: newDeal._id }, ...prev]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeDeal = deals.find(d => d.id === active.id);
    const overId = over.id;

    const isStage = STAGES.some(s => s.id === overId);

    if (isStage && activeDeal.status !== overId) {
      // Optimistic update
      setDeals(prev => prev.map(d => d.id === active.id ? { ...d, status: overId } : d));

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await axios.put(`/api/deals/${active.id}`, { status: overId }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (err) {
        console.error('Failed to update deal status');
        fetchDeals(); // Revert on failure
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      // Reordering logic could be added here
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 mb-1">
            <Trophy className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Deal Pipeline</h3>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Enterprise Deals</h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter deals..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2 px-6 flex items-center space-x-2 shadow-lg shadow-primary-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={deals.filter(d => d.status === stage.id)}
                onProbabilityClick={(deal) => setActiveProbabilityDeal(deal)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="rotate-3 shadow-2xl opacity-90 scale-105 transition-transform">
                <SortableDealCard deal={deals.find(d => d.id === activeId)} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Summary Footer */}
      <div className="glass-card p-4 flex items-center justify-between border-primary-100 bg-primary-50/20 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Pipeline Value</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">$145,500</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Conversion Goal</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">68%</p>
            </div>
          </div>
        </div>
        <div className="flex items-center -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-pink-200 dark:border-slate-800"></div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white dark:border-slate-800">
            +12
          </div>
        </div>
      </div>

      <AddDealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDealAdded={handleDealAdded}
      />
      
      <DealProbabilityModal
        isOpen={!!activeProbabilityDeal}
        onClose={() => setActiveProbabilityDeal(null)}
        deal={activeProbabilityDeal}
      />
    </div>
  );
};

export default Deals;
