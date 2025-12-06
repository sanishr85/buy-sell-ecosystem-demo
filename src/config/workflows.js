/**
 * Complete Workflow System - Buyer & Seller Journeys
 */

export const WORKFLOW_TYPES = {
  SERVICE: 'service',
  DELIVERY: 'delivery',
  DIGITAL: 'digital',
  CONSULTING: 'consulting',
  CUSTOM: 'custom',
};

// ============================================
// BUYER-FACING STATUSES (What buyer sees)
// ============================================
export const BUYER_STATUSES = {
  awaiting_offers: {
    label: 'Awaiting Offers',
    icon: '📢',
    color: '#2196F3',
    description: 'Waiting for sellers to submit offers'
  },
  review_offers: {
    label: 'Review Offers',
    icon: '👀',
    color: '#FF9800',
    description: 'You have pending offers to review'
  },
  payment_pending: {
    label: 'Payment Pending',
    icon: '💳',
    color: '#F44336',
    description: 'Complete payment to start work'
  },
  payment_held: {
    label: 'Payment Held',
    icon: '💰',
    color: '#4CAF50',
    description: 'Payment in escrow, work starting soon'
  },
  scheduled: {
    label: 'Scheduled',
    icon: '📅',
    color: '#2196F3',
    description: 'Appointment scheduled'
  },
  in_progress: {
    label: 'In Progress',
    icon: '⚙️',
    color: '#FF9800',
    description: 'Work is ongoing'
  },
  in_transit: {
    label: 'In Transit',
    icon: '🚚',
    color: '#FF9800',
    description: 'Delivery in progress'
  },
  delivered: {
    label: 'Delivered',
    icon: '📦',
    color: '#4CAF50',
    description: 'Confirm receipt or raise dispute'
  },
  dispute_pending: {
    label: 'Dispute Pending',
    icon: '⚠️',
    color: '#F44336',
    description: 'Escrow frozen, resolving issue'
  },
  dispute_resolved: {
    label: 'Dispute Resolved',
    icon: '✅',
    color: '#4CAF50',
    description: 'Issue resolved'
  },
  completed: {
    label: 'Completed',
    icon: '🎉',
    color: '#4CAF50',
    description: 'Job completed successfully'
  },
  cancelled: {
    label: 'Cancelled',
    icon: '❌',
    color: '#9E9E9E',
    description: 'Order cancelled'
  }
};

// ============================================
// SELLER-FACING STATUSES (What seller can update to)
// ============================================
export const STATUS_WORKFLOWS = {
  service: {
    name: 'Service Work',
    statuses: [
      {
        value: 'payment_held',
        label: 'Payment Received',
        icon: '💰',
        color: '#4CAF50',
        description: 'Payment secured, ready to start',
        nextStatuses: ['scheduled', 'in_progress']
      },
      {
        value: 'scheduled',
        label: 'Scheduled',
        icon: '📅',
        color: '#2196F3',
        description: 'Appointment set',
        nextStatuses: ['in_progress', 'on_hold']
      },
      {
        value: 'in_progress',
        label: 'In Progress',
        icon: '⚙️',
        color: '#FF9800',
        description: 'Currently working',
        nextStatuses: ['on_hold', 'delivered']
      },
      {
        value: 'on_hold',
        label: 'On Hold',
        icon: '⏸️',
        color: '#9E9E9E',
        description: 'Temporarily paused',
        nextStatuses: ['in_progress']
      },
      {
        value: 'delivered',
        label: 'Mark as Delivered',
        icon: '✅',
        color: '#4CAF50',
        description: 'Job completed, awaiting confirmation',
        nextStatuses: []
      }
    ]
  },
  
  delivery: {
    name: 'Delivery/Logistics',
    statuses: [
      {
        value: 'payment_held',
        label: 'Payment Received',
        icon: '💰',
        color: '#4CAF50',
        description: 'Preparing for delivery',
        nextStatuses: ['scheduled', 'preparing']
      },
      {
        value: 'scheduled',
        label: 'Pickup Scheduled',
        icon: '📅',
        color: '#2196F3',
        description: 'Scheduled for pickup',
        nextStatuses: ['preparing']
      },
      {
        value: 'preparing',
        label: 'Preparing Order',
        icon: '📦',
        color: '#2196F3',
        description: 'Getting items ready',
        nextStatuses: ['in_transit']
      },
      {
        value: 'in_transit',
        label: 'In Transit',
        icon: '🚚',
        color: '#FF9800',
        description: 'On the way',
        nextStatuses: ['delivered']
      },
      {
        value: 'delivered',
        label: 'Mark as Delivered',
        icon: '📍',
        color: '#4CAF50',
        description: 'Package delivered',
        nextStatuses: []
      }
    ]
  },

  digital: {
    name: 'Digital Product/Service',
    statuses: [
      {
        value: 'payment_held',
        label: 'Payment Received',
        icon: '💰',
        color: '#4CAF50',
        description: 'Starting work',
        nextStatuses: ['in_progress']
      },
      {
        value: 'in_progress',
        label: 'In Progress',
        icon: '💻',
        color: '#2196F3',
        description: 'Working on it',
        nextStatuses: ['review_ready', 'delivered']
      },
      {
        value: 'review_ready',
        label: 'Ready for Review',
        icon: '👀',
        color: '#FF9800',
        description: 'Draft ready for feedback',
        nextStatuses: ['revision', 'delivered']
      },
      {
        value: 'revision',
        label: 'Making Revisions',
        icon: '🔄',
        color: '#9E9E9E',
        description: 'Incorporating feedback',
        nextStatuses: ['review_ready', 'delivered']
      },
      {
        value: 'delivered',
        label: 'Mark as Delivered',
        icon: '✅',
        color: '#4CAF50',
        description: 'Final delivery',
        nextStatuses: []
      }
    ]
  },

  consulting: {
    name: 'Consulting/Coaching',
    statuses: [
      {
        value: 'payment_held',
        label: 'Payment Received',
        icon: '💰',
        color: '#4CAF50',
        description: 'Scheduling session',
        nextStatuses: ['scheduled']
      },
      {
        value: 'scheduled',
        label: 'Session Scheduled',
        icon: '📅',
        color: '#2196F3',
        description: 'Meeting confirmed',
        nextStatuses: ['in_progress']
      },
      {
        value: 'in_progress',
        label: 'Session In Progress',
        icon: '💬',
        color: '#FF9800',
        description: 'Ongoing consultation',
        nextStatuses: ['follow_up', 'delivered']
      },
      {
        value: 'follow_up',
        label: 'Follow-up Work',
        icon: '📝',
        color: '#9E9E9E',
        description: 'Additional deliverables',
        nextStatuses: ['delivered']
      },
      {
        value: 'delivered',
        label: 'Mark as Delivered',
        icon: '✅',
        color: '#4CAF50',
        description: 'Consultation complete',
        nextStatuses: []
      }
    ]
  },

  custom: {
    name: 'Custom Work',
    statuses: [
      {
        value: 'payment_held',
        label: 'Payment Received',
        icon: '💰',
        color: '#4CAF50',
        description: 'Starting work',
        nextStatuses: ['in_progress']
      },
      {
        value: 'in_progress',
        label: 'In Progress',
        icon: '⚙️',
        color: '#FF9800',
        description: 'Working on it',
        nextStatuses: ['delivered']
      },
      {
        value: 'delivered',
        label: 'Mark as Delivered',
        icon: '✅',
        color: '#4CAF50',
        description: 'Work completed',
        nextStatuses: []
      }
    ]
  },
};

// ============================================
// DISPUTE REASONS
// ============================================
export const DISPUTE_REASONS = [
  { value: 'not_delivered', label: 'Not Delivered', icon: '📦' },
  { value: 'incomplete', label: 'Incomplete Service', icon: '⚠️' },
  { value: 'poor_quality', label: 'Poor Quality', icon: '👎' },
  { value: 'not_as_described', label: 'Not as Described', icon: '❌' },
  { value: 'damaged', label: 'Damaged/Defective', icon: '🔨' },
  { value: 'wrong_item', label: 'Wrong Item/Service', icon: '🔄' },
  { value: 'other', label: 'Other Issue', icon: '💬' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getWorkflowForCategory = (category) => {
  const categoryWorkflowMap = {
    'Home Services': WORKFLOW_TYPES.SERVICE,
    'Repair': WORKFLOW_TYPES.SERVICE,
    'Cleaning': WORKFLOW_TYPES.SERVICE,
    'Installation': WORKFLOW_TYPES.SERVICE,
    'Maintenance': WORKFLOW_TYPES.SERVICE,
    
    'Delivery': WORKFLOW_TYPES.DELIVERY,
    'Moving': WORKFLOW_TYPES.DELIVERY,
    'Shopping': WORKFLOW_TYPES.DELIVERY,
    'Pickup': WORKFLOW_TYPES.DELIVERY,
    'Food': WORKFLOW_TYPES.DELIVERY,
    
    'Design': WORKFLOW_TYPES.DIGITAL,
    'Development': WORKFLOW_TYPES.DIGITAL,
    'Writing': WORKFLOW_TYPES.DIGITAL,
    'Editing': WORKFLOW_TYPES.DIGITAL,
    
    'Consulting': WORKFLOW_TYPES.CONSULTING,
    'Coaching': WORKFLOW_TYPES.CONSULTING,
    'Training': WORKFLOW_TYPES.CONSULTING,
    'Advice': WORKFLOW_TYPES.CONSULTING,
    
    'Other': WORKFLOW_TYPES.CUSTOM,
  };

  return categoryWorkflowMap[category] || WORKFLOW_TYPES.CUSTOM;
};

export const getNextStatuses = (currentStatus, workflowType) => {
  const workflow = STATUS_WORKFLOWS[workflowType];
  if (!workflow) return [];

  const currentStatusObj = workflow.statuses.find(s => s.value === currentStatus);
  if (!currentStatusObj) return [];

  return workflow.statuses.filter(s => 
    currentStatusObj.nextStatuses.includes(s.value)
  );
};

export const getStatusInfo = (status, workflowType) => {
  const workflow = STATUS_WORKFLOWS[workflowType];
  if (!workflow) return null;

  return workflow.statuses.find(s => s.value === status);
};

export const getBuyerStatusInfo = (status) => {
  return BUYER_STATUSES[status] || null;
};

export const getAllStatuses = (workflowType) => {
  const workflow = STATUS_WORKFLOWS[workflowType];
  return workflow ? workflow.statuses : [];
};

// Check if dispute window is still open (24-48 hours after delivery)
export const canRaiseDispute = (deliveredAt) => {
  if (!deliveredAt) return false;
  const hoursSinceDelivery = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60);
  return hoursSinceDelivery <= 48;
};
