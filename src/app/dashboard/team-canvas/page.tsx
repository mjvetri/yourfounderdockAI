import React from 'react';
import CanvasWorkspace from '../../../components/canvas/CanvasWorkspace';

const sections = [
  { key: 'peopleRoles', label: 'People & Roles', placeholder: 'Names and roles on the team' },
  { key: 'commonGoals', label: 'Common Goals', placeholder: 'What does the team want to achieve? Feasible, measurable, time-bound' },
  { key: 'values', label: 'Values', placeholder: 'What do you stand for? Guiding principles' },
  { key: 'purpose', label: 'Purpose', placeholder: 'Why does this team exist? What are we doing in the first place?' },
  { key: 'personalGoals', label: 'Personal Goals', placeholder: 'Individual goals or agendas team members want to be open about' },
  { key: 'needsExpectations', label: 'Needs & Expectations', placeholder: 'What does each person need to be successful?' },
  { key: 'rulesActivities', label: 'Rules & Activities', placeholder: 'How do you communicate, decide, and stay up to date?' },
  { key: 'strengths', label: 'Strengths & Assets', placeholder: 'Skills and soft skills the team has' },
  { key: 'weaknessesRisks', label: 'Weaknesses & Risks', placeholder: 'Gaps, obstacles, or risks the team should know about' },
];

export default function TeamCanvasPage() {
  return <CanvasWorkspace canvasType="team" pageTitle="Team Canvas" pageDescription="Map out your team's roles, goals, and risks — the AI flags what's solid and what's shaky." sections={sections} />;
}
