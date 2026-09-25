import React from 'react';
import CanvasWorkspace from '../../../components/canvas/CanvasWorkspace';

const sections = [
  { key: 'vision', label: 'Vision', placeholder: 'What is your purpose for creating this product? What positive change should it bring?', span: 2 as const },
  { key: 'targetGroup', label: 'Target Group', placeholder: 'Which market or segment does this address? Who are the users?' },
  { key: 'needs', label: 'Needs', placeholder: 'What problem does the product solve? What benefit does it provide?' },
  { key: 'product', label: 'Product', placeholder: 'What is it? What makes it stand out? Is it feasible?' },
  { key: 'businessGoals', label: 'Business Goals', placeholder: 'How does this benefit the company? What are the business goals?' },
];

export default function VisionBoardPage() {
  return <CanvasWorkspace canvasType="vision" pageTitle="Product Vision Board" pageDescription="Define the vision, target group, and goals — the AI checks how coherent and grounded it is." sections={sections} />;
}
