import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Heart, 
  Reply, 
  Search, 
  Filter,
  Clock,
  User,
  Tag,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

export default function Forum() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { forumPosts, addForumPost, addForumReply, likePost, likeReply } = useData();
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'my-posts'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [newReply, setNewReply] = useState('');

  // Add notification when someone interacts with forum posts
  const addNotification = (type: string, message: string) => {
    // This would typically be handled by a notification service
    console.log('Forum notification:', type, message);
    
    // Simulate adding notification to the notification center
    const event = new CustomEvent('forumNotification', {
      detail: {
        type: 'forum',
        title: language === 'te' ? 'ఫోరమ్ అప్‌డేట్' : 'Forum Update',
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low',
        icon: '💬'
      }
    });
    window.dispatchEvent(event);
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    addForumPost({
      userId: user.id,
      userName: user.name,
      title: newPost.title,
      content: newPost.content,
      language: language,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      likes: 0,
      replies: []
    });

    // Add notification for new post
    addNotification('new_post', language === 'te' 
      ? `కొత్త పోస్ట్ జోడించబడింది: "${newPost.title}"`
      : `New post added: "${newPost.title}"`
    );

    setNewPost({ title: '', content: '', tags: '' });
    setShowNewPost(false);
  };

  const handleAddReply = (postId: string) => {
    if (!newReply.trim() || !user) return;

    addForumReply(postId, {
      userId: user.id,
      userName: user.name,
      content: newReply,
      likes: 0
    });

    // Add notification for new reply
    const post = forumPosts.find(p => p.id === postId);
    if (post) {
      addNotification('new_reply', language === 'te'
        ? `మీ పోస్ట్‌కు కొత్త జవాబు వచ్చింది: "${post.title}"`
        : `New reply to your post: "${post.title}"`
      );
    }

    setNewReply('');
  };

  const handleLikePost = (postId: string) => {
    likePost(postId);
    
    // Add notification for like
    const post = forumPosts.find(p => p.id === postId);
    if (post) {
      addNotification('post_liked', language === 'te'
        ? `మీ పోస్ట్‌కు లైక్ వచ్చింది: "${post.title}"`
        : `Your post was liked: "${post.title}"`
      );
    }
  };

  const handleLikeReply = (postId: string, replyId: string) => {
    likeReply(postId, replyId);
    
    // Add notification for reply like
    addNotification('reply_liked', language === 'te'
      ? 'మీ జవాబుకు లైక్ వచ్చింది'
      : 'Your reply was liked'
    );
  };

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'popular':
        return matchesSearch && post.likes > 2;
      case 'my-posts':
        return matchesSearch && post.userId === user?.id;
      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    if (activeTab === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === 'te' ? 'ఇప్పుడే' : 'Just now';
    if (diffInHours < 24) return `${diffInHours}${language === 'te' ? ' గంటల క్రితం' : 'h ago'}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}${language === 'te' ? ' రోజుల క్రితం' : 'd ago'}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('forum.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'రైతు సమాజంతో మీ అనుభవాలను పంచుకోండి'
              : 'Share your farming experiences with the community'
            }
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('forum.askQuestion')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'te' ? 'చర్చలను వెతకండి...' : 'Search discussions...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: 'recent', label: t('forum.recent'), icon: Clock },
              { key: 'popular', label: t('forum.popular'), icon: TrendingUp },
              { key: 'my-posts', label: t('forum.myPosts'), icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('forum.askQuestion')}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'శీర్షిక' : 'Title'}
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'మీ ప్రశ్న లేదా విషయం...' : 'Your question or topic...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'వివరణ' : 'Description'}
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'మీ ప్రశ్న లేదా అనుభవాన్ని వివరంగా వ్రాయండి...' : 'Describe your question or experience in detail...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'ట్యాగ్‌లు' : 'Tags'}
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'కామాతో వేరు చేయండి (ఉదా: పత్తి, వ్యాధి, నీరు)' : 'Comma separated (e.g. cotton, disease, water)'}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('common.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'te' ? 'చర్చలు లేవు' : 'No discussions found'}
            </h3>
            <p className="text-gray-500">
              {language === 'te' 
                ? 'మొదటి ప్రశ్న అడిగి చర్చను ప్రారంభించండి'
                : 'Be the first to start a discussion'
              }
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.userName}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replies.length}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  {selectedPost === post.id ? t('common.close') : t('forum.reply')}
                </button>
              </div>
              
              {/* Replies Section */}
              {selectedPost === post.id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {/* Existing Replies */}
                  {post.replies.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{reply.userName}</span>
                              <span>•</span>
                              <span>{getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <Heart className="h-3 w-3" />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* New Reply Form */}
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder={language === 'te' ? 'మీ జవాబు వ్రాయండి...' : 'Write your reply...'}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button
                      onClick={() => handleAddReply(post.id)}
                      disabled={!newReply.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
                    >
                      <Reply className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}