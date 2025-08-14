import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader, History, X, Bot, User } from 'lucide-react';
import { userTracker } from '../services/userInteractionTracker';

interface ChatGPTAdviceBoxProps {
  dashboardType: string;
  currentContext?: string;
  onClose: () => void;
}

interface AdviceMessage {
  id: number;
  user_question: string;
  chatgpt_response: string;
  dashboard_type: string;
  response_time_ms: number;
  created_at: string;
}

const ChatGPTAdviceBox: React.FC<ChatGPTAdviceBoxProps> = ({ 
  dashboardType, 
  currentContext,
  onClose 
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AdviceMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get OpenAI API key from environment variables
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here';

  // Load advice history when component mounts
  useEffect(() => {
    loadAdviceHistory();
  }, [dashboardType]);

  const loadAdviceHistory = async () => {
    try {
      // Simulate loading history - in real app would call API
      const mockHistory: AdviceMessage[] = [
        {
          id: 1,
          user_question: "How can I improve student attendance?",
          chatgpt_response: "Consider implementing attendance incentives, sending automated reminders to parents, and tracking patterns to identify at-risk students early.",
          dashboard_type: dashboardType,
          response_time_ms: 1200,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          user_question: "What's the best way to organize my gradebook?",
          chatgpt_response: "Organize by assignment categories (tests, homework, projects), use consistent naming conventions, and regularly backup your data.",
          dashboard_type: dashboardType,
          response_time_ms: 950,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load advice history:', error);
    }
  };

  const handleGetAdvice = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    // Track advice request
    userTracker.trackDashboardEvent('chatgpt_advice_requested', {
      question: question.substring(0, 100), // First 100 chars for privacy
      dashboardType,
      currentContext,
      questionLength: question.length
    });

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI teaching assistant helping with ${dashboardType} tasks. Provide practical, actionable advice for educators. Keep responses concise but helpful.`
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      setResponse(aiResponse);
      setQuestion(''); // Clear the question
      
      // Track successful advice received
      userTracker.trackDashboardEvent('chatgpt_advice_received', {
        responseReceived: true,
        dashboardType,
        currentContext
      });

      // Add to history
      const newHistoryItem: AdviceMessage = {
        id: Date.now(),
        user_question: question,
        chatgpt_response: aiResponse,
        dashboard_type: dashboardType,
        response_time_ms: Date.now() - Date.now(), // Would calculate actual response time
        created_at: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error) {
      console.error('Error getting ChatGPT advice:', error);
      setError(error instanceof Error ? error.message : 'Failed to get advice');
      
      // Track error
      userTracker.trackDashboardEvent('chatgpt_advice_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        dashboardType,
        currentContext
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAdvice = (question: string, type: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('attendance')) {
      return "To improve attendance, consider: 1) Implementing a positive reinforcement system with rewards for good attendance, 2) Sending automated reminders to parents via email or SMS, 3) Tracking attendance patterns to identify students at risk, 4) Creating engaging lesson plans that students don't want to miss, and 5) Establishing clear attendance policies with consistent enforcement.";
    }
    
    if (lowerQuestion.includes('grade') || lowerQuestion.includes('assessment')) {
      return "For effective grading: 1) Use rubrics to ensure consistent evaluation, 2) Provide timely feedback within 48-72 hours, 3) Offer opportunities for revision and improvement, 4) Balance formative and summative assessments, 5) Use a variety of assessment methods to accommodate different learning styles, and 6) Keep detailed records for parent conferences.";
    }
    
    if (lowerQuestion.includes('course') || lowerQuestion.includes('curriculum')) {
      return "For course management: 1) Align curriculum with learning objectives, 2) Use backward design starting with end goals, 3) Incorporate diverse teaching methods and materials, 4) Plan for differentiated instruction, 5) Build in regular assessment checkpoints, and 6) Stay flexible to adjust based on student needs and progress.";
    }
    
    if (lowerQuestion.includes('student') || lowerQuestion.includes('engagement')) {
      return "To boost student engagement: 1) Use interactive teaching methods like group work and discussions, 2) Connect lessons to real-world applications, 3) Incorporate technology meaningfully, 4) Provide choice in assignments when possible, 5) Build positive relationships with students, and 6) Create a supportive classroom environment where mistakes are learning opportunities.";
    }
    
    // Default advice based on dashboard type
    switch (type.toLowerCase()) {
      case 'teacher':
        return "As a teacher, focus on building strong relationships with students, using data to inform instruction, collaborating with colleagues, and continuously reflecting on your practice. Consider implementing formative assessments, differentiated instruction, and positive behavior supports.";
      case 'attendance':
        return "For attendance management, establish clear policies, communicate regularly with parents, track patterns, and create engaging lessons. Consider implementing attendance incentives and early intervention strategies for at-risk students.";
      case 'course selection':
        return "When managing courses, ensure proper enrollment balance, monitor capacity, provide clear course descriptions, and support students in making informed choices. Regular communication with counselors and parents is key.";
      case 'current items':
        return "For task management, prioritize by urgency and importance, break large tasks into smaller steps, set realistic deadlines, and regularly review progress. Use digital tools to stay organized and maintain work-life balance.";
      default:
        return "Based on your question, I recommend taking a systematic approach: 1) Clearly define the problem or goal, 2) Research best practices, 3) Start with small, manageable changes, 4) Monitor progress and adjust as needed, 5) Seek feedback from colleagues and students, and 6) Document what works for future reference.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGetAdvice();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDashboardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'teacher': return '👩‍🏫';
      case 'ceo': return '👔';
      case 'itspecialist': return '💻';
      case 'teamleader': return '👨‍💼';
      case 'attendance': return '📅';
      case 'course selection': return '📚';
      case 'current items': return '📋';
      default: return '🤖';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">AI Teaching Assistant</h3>
            <p className="text-sm text-purple-200">
              {getDashboardIcon(dashboardType)} {dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Help
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              userTracker.trackDashboardEvent('chatgpt_history_toggled', { 
                dashboardType, 
                showHistory: !showHistory 
              });
            }}
            className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              userTracker.trackDashboardEvent('chatgpt_advice_closed', { dashboardType });
            }}
            className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {showHistory ? (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <History className="h-4 w-4 mr-2" />
              Recent Conversations
            </h4>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((msg) => (
                  <div key={msg.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2 mb-2">
                      <User className="h-4 w-4 text-blue-600 mt-1" />
                      <p className="text-sm text-gray-700 font-medium">{msg.user_question}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Bot className="h-4 w-4 text-purple-600 mt-1" />
                      <p className="text-sm text-gray-600">{msg.chatgpt_response.substring(0, 150)}...</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {formatDate(msg.created_at)} • {msg.response_time_ms}ms
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No previous conversations</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Response */}
            {response && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-2 mb-2">
                  <Bot className="h-5 w-5 text-purple-600 mt-1" />
                  <h4 className="font-semibold text-purple-800">AI Advice:</h4>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{response}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Question Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Ask for advice about your {dashboardType} tasks:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`e.g., "How can I improve student attendance?" or "What's the best way to organize my ${currentContext || 'dashboard'}?"`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleGetAdvice}
                disabled={isLoading || !question.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Getting Advice...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Get AI Advice</span>
                  </>
                )}
              </button>
            </div>

            {/* Usage Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="font-medium text-blue-800 mb-2">💡 Tips for better advice:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about your challenge or goal</li>
                <li>• Mention any constraints or requirements</li>
                <li>• Ask about best practices for your role</li>
                {OPENAI_API_KEY === 'your-openai-api-key-here' && (
                  <li className="text-orange-600">• Add VITE_OPENAI_API_KEY to .env file for real AI responses</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPTAdviceBox;