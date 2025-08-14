import React from 'react';
import {
  Users, BookOpen, FileText, BarChart3, Calendar, 
  MessageSquare, UserCheck, Mail, PieChart, FolderOpen, 
  DollarSign, Shield, Headphones, AlertCircle, Monitor, 
  Target, Award, GraduationCap, Crown
} from 'lucide-react';
import { Occupation } from '../types/dashboard';

export function getInitialOccupations(): Occupation[] {
  return [
    {
      id: 'teacher',
      name: 'Sarah Johnson',
      role: 'Teacher',
      title: 'Teacher Dashboard',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
      features: [
        {
          id: '1',
          icon: <UserCheck className="h-8 w-8 text-blue-600" />,
          title: 'Attendance',
          description: 'Track student attendance and generate reports',
          metric: 'Today: 28/30 Present',
          color: 'blue',
          link: '/attendance',
          status: 'pending'
        },
        {
          id: '2',
          icon: <BookOpen className="h-8 w-8 text-blue-600" />,
          title: 'Grades Management',
          description: 'Record and manage student grades',
          metric: '42 Assignments Graded',
          color: 'blue',
          link: '/grades',
          status: 'pending'
        },
        {
          id: '3',
          icon: <FileText className="h-8 w-8 text-blue-600" />,
          title: 'Assignments',
          description: 'Create and manage student assignments',
          metric: '15 Active Assignments',
          color: 'blue',
          link: '/assignments',
          status: 'pending'
        },
        {
          id: '4',
          icon: <Calendar className="h-8 w-8 text-blue-600" />,
          title: 'Students Management',
          description: 'Manage student information and records',
          metric: '25 Active Students',
          color: 'blue',
          link: '/students',
          status: 'pending'
        },
        {
          id: '5',
          icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
          title: 'Analytics Dashboard',
          description: 'View comprehensive teaching insights',
          metric: 'Class Average: 87%',
          color: 'blue',
          link: '/analytics',
          status: 'pending'
        },
        {
          id: '6',
          icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
          title: 'Current Items',
          description: 'Manage ongoing tasks and assignments',
          metric: '8 Active Tasks',
          color: 'blue',
          link: '/current-items',
          status: 'pending'
        },
        {
          id: '7',
          icon: <FileText className="h-8 w-8 text-blue-600" />,
          title: 'Current Items',
          description: 'Manage ongoing tasks and assignments',
          metric: '8 Active Tasks',
          color: 'blue',
          status: 'pending'
        }
      ]
    },
    {
      id: 'ceo',
      name: 'Michael Chen',
      role: 'CEO',
      title: 'CEO Dashboard',
      icon: <Crown className="h-6 w-6" />,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-700',
      features: [
        {
          id: '1',
          icon: <PieChart className="h-8 w-8 text-purple-600" />,
          title: 'Company Analytics',
          description: 'Monitor business performance and KPIs',
          metric: 'Revenue: +15% YoY',
          color: 'purple',
          link: 'https://analytics.google.com/dashboard',
          status: 'pending'
        },
        {
          id: '2',
          icon: <Users className="h-8 w-8 text-purple-600" />,
          title: 'Team Management',
          description: 'Oversee departments and team leaders',
          metric: '250 Employees',
          color: 'purple',
          link: 'https://slack.com/team-management',
          status: 'pending'
        },
        {
          id: '3',
          icon: <Calendar className="h-8 w-8 text-purple-600" />,
          title: 'Board Meetings',
          description: 'Schedule and manage board meetings',
          metric: 'Next: Q4 Review',
          color: 'purple',
          link: 'https://calendly.com/board-meetings',
          status: 'pending'
        },
        {
          id: '4',
          icon: <DollarSign className="h-8 w-8 text-purple-600" />,
          title: 'Financial Planning',
          description: 'Budget allocation and financial strategy',
          metric: 'Budget: $2.5M',
          color: 'purple',
          link: 'https://quickbooks.intuit.com/budget',
          status: 'pending'
        },
        {
          id: '5',
          icon: <Target className="h-8 w-8 text-purple-600" />,
          title: 'Strategic Planning',
          description: 'Set company vision and long-term goals',
          metric: '5 Year Plan Active',
          color: 'purple',
          link: 'https://miro.com/strategic-planning',
          status: 'pending'
        },
        {
          id: '6',
          icon: <Mail className="h-8 w-8 text-purple-600" />,
          title: 'Executive Communications',
          description: 'Company-wide announcements and updates',
          metric: '12 Pending Messages',
          color: 'purple',
          link: 'https://outlook.office.com/executive',
          status: 'pending'
        }
      ]
    },
    {
      id: 'itSpecialist',
      name: 'Alex Rodriguez',
      role: 'IT Specialist',
      title: 'IT Specialist Dashboard',
      icon: <Monitor className="h-6 w-6" />,
      color: 'green',
      gradient: 'from-green-500 to-green-700',
      features: [
        {
          id: '1',
          icon: <AlertCircle className="h-8 w-8 text-green-600" />,
          title: 'Ticket System',
          description: 'Manage and resolve IT support tickets',
          metric: '8 Open Tickets',
          color: 'green',
          link: 'https://jira.atlassian.com/tickets',
          status: 'pending'
        },
        {
          id: '2',
          icon: <Monitor className="h-8 w-8 text-green-600" />,
          title: 'System Monitoring',
          description: 'Monitor server health and performance',
          metric: 'All Systems Online',
          color: 'green',
          link: 'https://datadog.com/monitoring',
          status: 'pending'
        },
        {
          id: '3',
          icon: <Shield className="h-8 w-8 text-green-600" />,
          title: 'Security Management',
          description: 'Maintain cybersecurity and data protection',
          metric: 'Security Score: 98%',
          color: 'green',
          link: 'https://security.microsoft.com/dashboard',
          status: 'pending'
        },
        {
          id: '4',
          icon: <Users className="h-8 w-8 text-green-600" />,
          title: 'User Management',
          description: 'Manage user accounts and permissions',
          metric: '156 Active Users',
          color: 'green',
          link: 'https://admin.google.com/users',
          status: 'pending'
        },
        {
          id: '5',
          icon: <FolderOpen className="h-8 w-8 text-green-600" />,
          title: 'Software Deployment',
          description: 'Deploy and update software systems',
          metric: '3 Updates Pending',
          color: 'green',
          link: 'https://jenkins.io/deployment',
          status: 'pending'
        },
        {
          id: '6',
          icon: <Headphones className="h-8 w-8 text-green-600" />,
          title: 'Help Desk',
          description: 'Provide technical support to users',
          metric: '15 Calls Today',
          color: 'green',
          link: 'https://zendesk.com/helpdesk',
          status: 'pending'
        }
      ]
    },
    {
      id: 'teamLeader',
      name: 'Emma Davis',
      role: 'Team Leader',
      title: 'Team Leader Dashboard',
      icon: <Target className="h-6 w-6" />,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-700',
      features: [
        {
          id: '1',
          icon: <Users className="h-8 w-8 text-orange-600" />,
          title: 'Team Overview',
          description: 'Monitor team performance and wellbeing',
          metric: '12 Team Members',
          color: 'orange',
          link: 'https://monday.com/team-overview',
          status: 'pending'
        },
        {
          id: '2',
          icon: <Target className="h-8 w-8 text-orange-600" />,
          title: 'Goal Tracking',
          description: 'Set and monitor team objectives',
          metric: '85% Goals Met',
          color: 'orange',
          link: 'https://asana.com/goals',
          status: 'pending'
        },
        {
          id: '3',
          icon: <Calendar className="h-8 w-8 text-orange-600" />,
          title: 'Meeting Scheduler',
          description: 'Organize team meetings and one-on-ones',
          metric: 'Next: Team Standup',
          color: 'orange',
          link: 'https://calendly.com/team-meetings',
          status: 'pending'
        },
        {
          id: '4',
          icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
          title: 'Performance Reviews',
          description: 'Conduct and track performance evaluations',
          metric: '3 Reviews Due',
          color: 'orange',
          link: 'https://bamboohr.com/performance',
          status: 'pending'
        },
        {
          id: '5',
          icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
          title: 'Team Communication',
          description: 'Facilitate team discussions and updates',
          metric: '5 New Messages',
          color: 'orange',
          link: 'https://teams.microsoft.com/communication',
          status: 'pending'
        },
        {
          id: '6',
          icon: <Award className="h-8 w-8 text-orange-600" />,
          title: 'Recognition Program',
          description: 'Acknowledge and reward team achievements',
          metric: '2 Awards This Month',
          color: 'orange',
          link: 'https://bonusly.com/recognition',
          status: 'pending'
        }
      ]
    }
  ];
}