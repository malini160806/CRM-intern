import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, User, Mail, CheckCircle2, Zap, Save } from 'lucide-react';

// Custom Nodes
const TriggerNode = ({ data }) => (
  <div className="bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-xl p-4 shadow-lg min-w-[200px]">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {data.iconType === 'play' ? <Play className="w-4 h-4" /> : 
         data.iconType === 'user' ? <User className="w-4 h-4" /> : 
         <Zap className="w-4 h-4" />}
      </div>
      <div className="font-bold text-slate-900 dark:text-white">{data.label}</div>
    </div>
    <div className="text-xs text-slate-500 font-medium">{data.description}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
  </div>
);

const ActionNode = ({ data }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'mail': return <Mail className="w-4 h-4" />;
      case 'check': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.colorClass || 'bg-blue-100 text-blue-600'}`}>
          {data.icon || getIcon(data.iconType)}
        </div>
        <div className="font-bold text-slate-900 dark:text-white">{data.label}</div>
      </div>
      <div className="text-xs text-slate-500 font-medium">{data.description}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

const initialNodes = [
  { 
    id: '1', 
    type: 'trigger', 
    position: { x: 250, y: 50 }, 
    data: { label: 'New Lead Created', description: 'When a lead enters the system', iconType: 'zap' } 
  },
  { 
    id: '2', 
    type: 'action', 
    position: { x: 250, y: 200 }, 
    data: { 
      label: 'AI Lead Enrichment', 
      description: 'Fetch company details via AI',
      icon: <CheckCircle2 className="w-4 h-4" />,
      colorClass: 'bg-emerald-100 text-emerald-600'
    } 
  },
  { 
    id: '3', 
    type: 'action', 
    position: { x: 250, y: 350 }, 
    data: { 
      label: 'Send Welcome Email', 
      description: 'Using AI drafted template',
      icon: <Mail className="w-4 h-4" />,
      colorClass: 'bg-blue-100 text-blue-600'
    } 
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
];

let id = 4;
const getId = () => `${id++}`;

const AutomationsContent = () => {
  // Load initial state from local storage or use defaults
  const loadState = () => {
    try {
      const saved = localStorage.getItem('crm_workflow_draft');
      if (saved) return JSON.parse(saved);
    } catch(e) { console.error("Error loading workflow", e) }
    return { nodes: initialNodes, edges: initialEdges };
  };

  const initialState = loadState();
  const [nodes, setNodes] = useState(initialState.nodes);
  const [edges, setEdges] = useState(initialState.edges);
  const [toastMsg, setToastMsg] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('crm_workflow_draft', JSON.stringify({ nodes, edges }));
    showToast("Draft saved successfully!");
  };

  const handlePublish = () => {
    localStorage.setItem('crm_workflow_published', JSON.stringify({ nodes, edges }));
    showToast("Workflow published to production! 🚀");
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#64748b', strokeWidth: 2 } }, eds)),
    [],
  );

  const onDragStart = (event, nodeType, actionType) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/actionType', actionType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getNodeData = (actionType) => {
    if (actionType === 'trigger-user') {
      return { label: 'User Action', description: 'Triggered by user', iconType: 'user' };
    } else if (actionType === 'trigger-time') {
      return { label: 'Time Based', description: 'Triggered by schedule', iconType: 'play' };
    } else if (actionType === 'action-email') {
      return { label: 'Send Email', description: 'Send an email', iconType: 'mail', colorClass: 'bg-blue-100 text-blue-600' };
    } else if (actionType === 'action-status') {
      return { label: 'Update Status', description: 'Change lead status', iconType: 'check', colorClass: 'bg-emerald-100 text-emerald-600' };
    }
    return {};
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const actionType = event.dataTransfer.getData('application/reactflow/actionType');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const data = getNodeData(actionType);

      const newNode = {
        id: getId(),
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onClickAdd = (type, actionType) => {
    const data = getNodeData(actionType);
    
    // Add slightly offset from top left to avoid completely overlapping
    const offset = (nodes.length % 5) * 20;
    const newNode = {
      id: getId(),
      type,
      position: { x: 350 + offset, y: 150 + offset },
      data,
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <Zap className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Workflow Builder</h3>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Automations</h2>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button 
            onClick={handlePublish}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Publish Workflow
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {toastMsg}
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-inner">
        
        {/* Tool panel */}
        <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col gap-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pt-1">Triggers</div>
          <div 
            className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors active:scale-95" 
            title="User Action" 
            onDragStart={(event) => onDragStart(event, 'trigger', 'trigger-user')} 
            onClick={() => onClickAdd('trigger', 'trigger-user')}
            draggable
          >
            <User className="w-5 h-5" />
          </div>
          <div 
            className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors active:scale-95" 
            title="Time Based" 
            onDragStart={(event) => onDragStart(event, 'trigger', 'trigger-time')} 
            onClick={() => onClickAdd('trigger', 'trigger-time')}
            draggable
          >
            <Play className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pt-2 border-t border-slate-200 dark:border-slate-700">Actions</div>
          <div 
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors active:scale-95" 
            title="Send Email" 
            onDragStart={(event) => onDragStart(event, 'action', 'action-email')} 
            onClick={() => onClickAdd('action', 'action-email')}
            draggable
          >
            <Mail className="w-5 h-5" />
          </div>
          <div 
            className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors active:scale-95" 
            title="Update Status" 
            onDragStart={(event) => onDragStart(event, 'action', 'action-status')} 
            onClick={() => onClickAdd('action', 'action-status')}
            draggable
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50 dark:bg-slate-900"
        >
          <Background color="#94a3b8" gap={16} size={1} />
          <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 fill-slate-600 dark:fill-slate-300" />
        </ReactFlow>
      </div>
    </div>
  );
};

const Automations = () => {
  return (
    <ReactFlowProvider>
      <AutomationsContent />
    </ReactFlowProvider>
  );
};

export default Automations;
