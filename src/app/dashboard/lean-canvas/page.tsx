import React from 'react';
import CanvasWorkspace from '../../../components/canvas/CanvasWorkspace';

const sections = [
  { key: 'problem', label: 'Problem', placeholder: 'Top 1-3 problems worth solving' },
  { key: 'existingAlternatives', label: 'Existing Alternatives', placeholder: 'How is this solved today?' },
  { key: 'solution', label: 'Solution', placeholder: 'Top 3 features that solve the problem' },
  { key: 'keyMetrics', label: 'Key Metrics', placeholder: 'The numbers that tell you how the business is doing' },
  { key: 'uniqueValueProposition', label: 'Unique Value Proposition', placeholder: "Single, clear message on why you're different and worth paying attention to" },
  { key: 'unfairAdvantage', label: 'Unfair Advantage', placeholder: "Something that can't easily be copied or bought" },
  { key: 'channels', label: 'Channels', placeholder: 'Path to customers' },
  { key: 'customerSegments', label: 'Customer Segments', placeholder: 'Target customers and users' },
  { key: 'earlyAdopters', label: 'Early Adopters', placeholder: 'Characteristics of your ideal early customer' },
  { key: 'costStructure', label: 'Cost Structure', placeholder: 'Fixed and variable costs', span: 2 as const },
  { key: 'revenueStreams', label: 'Revenue Streams', placeholder: 'Sources of revenue', span: 2 as const },
];

export default function LeanCanvasPage() {
  return <CanvasWorkspace canvasType="lean" pageTitle="Lean Canvas" pageDescription="Lay out your business model in one page — the AI checks what's validated, uncertain, or risky." sections={sections} />;
}
