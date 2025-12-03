import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, BookOpen, LayoutDashboard, LogIn, LogOut, 
  CheckCircle, Play, FileText, Lock, ShieldCheck, Video, 
  Users, DollarSign, Upload, Plus
} from 'lucide-react';
import { Button } from './components/Button';
import { CourseCard } from './components/CourseCard';
import { MOCK_COURSES, VODAFONE_CASH_NUMBER, SUBSCRIPTION_PRICE } from './constants';
import { authService } from './services/authService';
import { Course, Material, User, MaterialType, UserRole } from './types';

// Mock database of users for the admin demo
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'أحمد محمد', email: 'ahmed@bis.com', role: UserRole.STUDENT, isSubscribed: false, pendingSubscription: true },
  { id: 'u2', name: 'سارة مصطفى', email: 'sara@bis.com', role: UserRole.STUDENT, isSubscribed: true, pendingSubscription: false },
  { id: 'u3', name: 'كريم عادل', email: 'karim@bis.com', role: UserRole.STUDENT, isSubscribed: false, pendingSubscription: true },
];

export default function App() {
  // --- Global State ---
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  // In a real app, users would be in a DB. Here we keep them in state for Admin to verify.
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);

  // --- UI State ---
  const [view, setView] = useState<'home' | 'courses' | 'dashboard' | 'course_detail' | 'admin_dashboard'>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(loginEmail);
      setUser(loggedUser);
      
      // If student logs in, ensure they are in the "allUsers" list for Admin to see
      if (loggedUser.role === UserRole.STUDENT) {
        setAllUsers(prev => {
           if (!prev.find(u => u.email === loggedUser.email)) {
             return [...prev, loggedUser];
           }
           return prev;
        });
      }

      setShowLoginModal(false);
      if (loggedUser.role === UserRole.ADMIN) {
        setView('admin_dashboard');
      } else {
        setView('home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('home');
    setSelectedCourse(null);
  };

  const handleRequestSubscription = () => {
    setIsLoading(true);
    // Simulate user requesting subscription
    setTimeout(() => {
      if (user) {
        const updatedUser = { ...user, pendingSubscription: true };
        setUser(updatedUser);
        // Update in "Database"
        setAllUsers(prev => prev.map(u => u.email === user.email ? updatedUser : u));
      }
      setIsLoading(false);
      setShowSubModal(false);
      alert('تم إرسال طلبك للإدارة! سيتم تفعيل الحساب فور مراجعة الدفع.');
    }, 1000);
  };

  // --- Admin Handlers ---
  const handleAdminApprove = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isSubscribed: true, pendingSubscription: false };
      }
      return u;
    }));
  };

  const handleAdminReject = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, pendingSubscription: false };
      }
      return u;
    }));
  };

  const handleAddMaterial = (courseId: string, title: string, type: MaterialType, url: string, duration?: string) => {
    const newMaterial: Material = {
      id: `new_${Date.now()}`,
      title,
      type,
      url,
      duration,
      isFree: false
    };

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, materials: [...c.materials, newMaterial] };
      }
      return c;
    }));
    alert('تم إضافة المحتوى بنجاح!');
  };

  const openCourse = (course: Course) => {
    // Refresh selected course from state to get latest materials
    const freshCourse = courses.find(c => c.id === course.id) || course;
    setSelectedCourse(freshCourse);
    setView('course_detail');
  };

  // --- Components ---
  
  const Navbar = () => (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
             <div className="bg-brand-primary p-1.5 rounded-lg">
                <BookOpen className="text-white" size={24} />
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide leading-none">Master Bis</span>
                <span className="text-[10px] text-brand-light opacity-80">الفرقة الثانية</span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('home')} className={`hover:text-brand-gold transition ${view === 'home' ? 'text-brand-gold font-bold' : ''}`}>الرئيسية</button>
            <button onClick={() => setView('courses')} className={`hover:text-brand-gold transition ${view === 'courses' ? 'text-brand-gold font-bold' : ''}`}>المواد الدراسية</button>
            {user && user.role === UserRole.STUDENT && (
              <button onClick={() => setView('dashboard')} className={`hover:text-brand-gold transition ${view === 'dashboard' ? 'text-brand-gold font-bold' : ''}`}>لوحة الطالب</button>
            )}
            {user && user.role === UserRole.ADMIN && (
              <button onClick={() => setView('admin_dashboard')} className={`hover:text-brand-gold transition ${view === 'admin_dashboard' ? 'text-brand-gold font-bold' : ''}`}>لوحة الإدارة</button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-brand-light">
                    {user.role === UserRole.ADMIN ? 'مدير المنصة' : (user.isSubscribed ? 'مشترك مميز' : 'حساب مجاني')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-white text-white hover:bg-white hover:text-brand-dark">
                  <LogOut size={16} />
                  خروج
                </Button>
              </div>
            ) : (
              <Button variant="gold" size="sm" onClick={() => setShowLoginModal(true)}>
                <LogIn size={16} />
                دخول / تسجيل
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-blue-900 pb-4">
          <div className="flex flex-col gap-2 p-4">
            <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="text-right p-2 hover:bg-white/10 rounded">الرئيسية</button>
            <button onClick={() => { setView('courses'); setMobileMenuOpen(false); }} className="text-right p-2 hover:bg-white/10 rounded">المواد الدراسية</button>
            {user?.role === UserRole.ADMIN && <button onClick={() => { setView('admin_dashboard'); setMobileMenuOpen(false); }} className="text-right p-2 hover:bg-white/10 rounded">لوحة الإدارة</button>}
            <div className="h-px bg-white/20 my-2"></div>
            {user ? (
              <button onClick={handleLogout} className="text-right p-2 text-red-300">تسجيل خروج</button>
            ) : (
              <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="text-right p-2 text-brand-gold">تسجيل دخول</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <div className="relative bg-brand-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-right">
          <div className="inline-block bg-brand-primary/30 px-4 py-1 rounded-full text-brand-light font-bold text-sm mb-6 border border-brand-primary/50">
            المنصة الأولى لطلاب الفرقة الثانية BIS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-brand-gold">Master Bis</span><br />
            تخصصك يبدأ من هنا
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            شرح مبسط لمواد التخصص (قواعد البيانات، محاسبة الشركات، إدارة الإنتاج). افهم المواد الصعبة بسهولة واضمن الامتياز.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="lg" onClick={() => setView('courses')}>ابدأ المذاكرة الآن</Button>
            {!user && <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark" onClick={() => setShowLoginModal(true)}>إنشاء حساب جديد</Button>}
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-brand-primary rounded-full opacity-30 blur-2xl animate-pulse"></div>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-illustration-download-in-svg-png-gif-file-formats--learning-study-school-student-digital-marketing-pack-business-illustrations-4039011.png" alt="Education" className="relative w-full max-w-md" />
            </div>
        </div>
      </div>
    </div>
  );

  const SubscriptionBanner = () => {
    if (user?.isSubscribed) return null;
    return (
      <div className="bg-gradient-to-r from-brand-primary to-brand-dark text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border border-brand-light/20">
        <div className="flex items-center gap-4">
          <div className="bg-brand-gold p-4 rounded-full text-brand-dark">
             <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">
              {user?.pendingSubscription ? 'طلبك قيد المراجعة...' : 'اشترك الآن في مواد الترم'}
            </h3>
            <p className="text-brand-light">
              {user?.pendingSubscription 
               ? 'سيتم تفعيل حسابك بمجرد مراجعة الإدارة للدفع.' 
               : 'احصل على شرح كامل لقواعد البيانات والمحاسبة والإنتاج.'}
            </p>
          </div>
        </div>
        <div className="text-center md:text-left">
           {!user?.pendingSubscription && (
             <>
               <div className="text-3xl font-bold text-brand-gold mb-2">{SUBSCRIPTION_PRICE} <span className="text-sm text-white font-normal">/ الترم</span></div>
               <Button variant="gold" onClick={() => setShowSubModal(true)}>اشترك الآن</Button>
             </>
           )}
           {user?.pendingSubscription && (
             <div className="bg-white/10 px-4 py-2 rounded text-brand-light text-sm">
                جاري التحقق من الدفع...
             </div>
           )}
        </div>
      </div>
    );
  };

  const CoursesView = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-brand-dark mb-8 border-r-4 border-brand-gold pr-4">مواد الفرقة الثانية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            isSubscribed={!!user?.isSubscribed}
            onView={openCourse}
          />
        ))}
      </div>
    </div>
  );

  const CourseDetailView = () => {
    if (!selectedCourse) return null;
    const isSubscribed = !!user?.isSubscribed;
    // Admins can see everything
    const canAccess = isSubscribed || user?.role === UserRole.ADMIN;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button variant="outline" size="sm" onClick={() => setView('courses')} className="mb-6">← العودة للمواد</Button>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="h-64 md:h-80 relative">
                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-8 text-white w-full">
                        <h1 className="text-4xl font-bold mb-2">{selectedCourse.title}</h1>
                        <p className="text-lg text-gray-200">{selectedCourse.instructor}</p>
                    </div>
                </div>
            </div>
            <div className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">{selectedCourse.description}</p>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
           <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h3 className="text-2xl font-bold text-brand-dark">محتوى المادة</h3>
              {!canAccess && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Lock size={14} /> وصول محدود
                  </span>
              )}
           </div>

           <div className="space-y-4">
             {selectedCourse.materials.map((material) => {
               const isLocked = !material.isFree && !canAccess;
               return (
                 <div key={material.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isLocked ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-100 hover:border-brand-primary hover:shadow-md cursor-pointer'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-brand-light/20 text-brand-primary'}`}>
                            {material.type === MaterialType.VIDEO ? <Video size={24} /> : 
                             material.type === MaterialType.PDF ? <FileText size={24} /> : 
                             <CheckCircle size={24} />}
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-dark text-lg">{material.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded ${material.type === MaterialType.QUIZ ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {material.type === MaterialType.VIDEO ? 'فيديو' : material.type === MaterialType.PDF ? 'ملف PDF' : 'امتحان'}
                                </span>
                                {material.duration && <span className="text-xs text-gray-500">{material.duration}</span>}
                                {material.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 rounded-full font-bold">مجاني</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        {isLocked ? (
                            <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed border-gray-300 text-gray-400">
                                <Lock size={16} />
                            </Button>
                        ) : (
                            <Button variant={material.type === MaterialType.QUIZ ? 'outline' : 'secondary'} size="sm">
                                {material.type === MaterialType.VIDEO ? <Play size={16} /> : 'فتح'}
                            </Button>
                        )}
                    </div>
                 </div>
               );
             })}
           </div>
           
           {!canAccess && (
               <div className="mt-8 text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                   <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                   <h4 className="text-xl font-bold text-gray-700 mb-2">اشترك لفتح باقي المحتوى</h4>
                   <p className="text-gray-500 mb-6">يوجد محتوى حصري متاح فقط للمشتركين.</p>
                   {user?.pendingSubscription ? (
                     <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">طلبك قيد المراجعة...</div>
                   ) : (
                     <Button variant="gold" onClick={() => setShowSubModal(true)}>اشترك الآن بـ {SUBSCRIPTION_PRICE}</Button>
                   )}
               </div>
           )}
        </div>
      </div>
    );
  };

  const DashboardView = () => {
      if (!user) return null;
      return (
          <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-3xl font-bold text-brand-dark mb-8">لوحة تحكم الطالب</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-brand-primary">
                      <div className="text-gray-500 text-sm mb-1">حالة الاشتراك</div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                          {user.isSubscribed ? (
                              <>
                                <span className="text-green-600">نشط</span>
                                <CheckCircle size={20} className="text-green-600" />
                              </>
                          ) : (
                             user.pendingSubscription ? (
                                <span className="text-yellow-600 text-lg">قيد المراجعة</span>
                             ) : (
                                <span className="text-red-500">غير مشترك</span>
                             )
                          )}
                      </div>
                      {!user.isSubscribed && !user.pendingSubscription && (
                          <Button variant="gold" size="sm" fullWidth className="mt-4" onClick={() => setShowSubModal(true)}>تفعيل الاشتراك</Button>
                      )}
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-400">
                      <div className="text-gray-500 text-sm mb-1">المواد المسجلة</div>
                      <div className="text-2xl font-bold text-brand-dark">{courses.length}</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-brand-gold">
                      <div className="text-gray-500 text-sm mb-1">التقدم العام</div>
                      <div className="text-2xl font-bold text-brand-dark">0%</div>
                  </div>
              </div>

              <h3 className="text-xl font-bold text-brand-dark mb-4">موادك الدراسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={course.thumbnail} className="w-16 h-16 rounded object-cover" alt="" />
                            <div>
                                <h4 className="font-bold text-brand-dark">{course.title}</h4>
                                <p className="text-sm text-gray-500">{course.instructor}</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => openCourse(course)}>متابعة</Button>
                    </div>
                ))}
              </div>
          </div>
      )
  };

  // --- Admin Dashboard Component ---
  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
    
    // Form state for adding content
    const [newMaterialCourse, setNewMaterialCourse] = useState(courses[0]?.id || '');
    const [newMaterialTitle, setNewMaterialTitle] = useState('');
    const [newMaterialType, setNewMaterialType] = useState<MaterialType>(MaterialType.VIDEO);
    const [newMaterialUrl, setNewMaterialUrl] = useState('');

    const pendingUsers = allUsers.filter(u => u.pendingSubscription && !u.isSubscribed);

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-brand-dark">لوحة تحكم الإدارة</h2>
          <div className="bg-white rounded-lg shadow p-1 flex">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-bold transition ${activeTab === 'users' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              طلبات الاشتراك ({pendingUsers.length})
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-md font-bold transition ${activeTab === 'content' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              رفع المحتوى
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                <DollarSign className="text-brand-gold" />
                طلبات الدفع المعلقة
              </h3>
            </div>
            {pendingUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                لا توجد طلبات اشتراك جديدة حالياً
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-4">اسم الطالب</th>
                      <th className="p-4">البريد الإلكتروني</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-bold">{u.name}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">بانتظار الموافقة</span></td>
                        <td className="p-4 flex gap-2">
                          <button 
                            onClick={() => handleAdminApprove(u.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                          >
                            تفعيل
                          </button>
                          <button 
                            onClick={() => handleAdminReject(u.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            رفض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2 mb-6">
              <Upload className="text-brand-primary" />
              إضافة فيديو أو ملف جديد
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اختر المادة</label>
                <select 
                  className="w-full border-gray-300 rounded-lg p-3 border bg-white"
                  value={newMaterialCourse}
                  onChange={(e) => setNewMaterialCourse(e.target.value)}
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المحتوى</label>
                <select 
                  className="w-full border-gray-300 rounded-lg p-3 border bg-white"
                  value={newMaterialType}
                  onChange={(e) => setNewMaterialType(e.target.value as MaterialType)}
                >
                  <option value={MaterialType.VIDEO}>فيديو</option>
                  <option value={MaterialType.PDF}>ملف PDF</option>
                  <option value={MaterialType.QUIZ}>امتحان</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الدرس</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-3 border"
                  placeholder="مثال: المحاضرة الخامسة - مسائل عملية"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الملف/الفيديو</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-3 border"
                  placeholder="https://..."
                  value={newMaterialUrl}
                  onChange={(e) => setNewMaterialUrl(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={() => {
              if(!newMaterialTitle) return alert('يرجى كتابة العنوان');
              handleAddMaterial(newMaterialCourse, newMaterialTitle, newMaterialType, newMaterialUrl);
              setNewMaterialTitle('');
              setNewMaterialUrl('');
            }}>
              <Plus size={18} />
              نشر المحتوى
            </Button>
          </div>
        )}
      </div>
    );
  };

  // --- Modals ---

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-[fadeIn_0.3s_ease-out]">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">مرحباً بك في Master Bis</h2>
        <p className="text-center text-gray-500 mb-8">سجل دخولك لمتابعة دروسك</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="example@bis.edu.eg"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
            {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400 bg-gray-50 p-2 rounded">
           <p>جرب الدخول كـ أدمن:</p>
           <p className="font-mono text-xs select-all">admin@masterbis.com</p>
        </div>
      </div>
    </div>
  );

  const SubscriptionModal = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
        <div className="bg-brand-dark p-6 text-white text-center relative">
             <button onClick={() => setShowSubModal(false)} className="absolute top-4 left-4 text-white/70 hover:text-white">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">تفعيل الاشتراك الكامل</h2>
            <p className="opacity-80">خطوة واحدة تفصلك عن التفوق</p>
        </div>
        
        <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-700 mb-3">حول مبلغ {SUBSCRIPTION_PRICE} عبر فودافون كاش:</p>
                <div className="bg-white border-2 border-brand-primary border-dashed rounded-lg p-3 text-2xl font-mono font-bold text-brand-dark tracking-wider select-all" dir="ltr">
                    {VODAFONE_CASH_NUMBER}
                </div>
                <p className="text-xs text-gray-500 mt-2">احتفظ بسكرين شوت للتحويل</p>
            </div>

            <Button variant="gold" fullWidth size="lg" onClick={handleRequestSubscription} disabled={isLoading}>
                {isLoading ? 'جاري الإرسال...' : 'تم التحويل، إرسال طلب تفعيل'}
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
                بعد الضغط، سيقوم الأدمن بمراجعة التحويل وتفعيل حسابك.
            </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <Navbar />

      <main className="min-h-[calc(100vh-64px)]">
        {view === 'admin_dashboard' && <AdminDashboard />}

        {view === 'home' && (
          <>
            <Hero />
            <div className="py-12 px-4 max-w-7xl mx-auto">
               <SubscriptionBanner />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="w-16 h-16 bg-brand-light/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                          <Video size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">محاضرات مكثفة</h3>
                      <p className="text-gray-600">شرح مركز لكل نقاط المنهج بدون حشو، مع التركيز على المسائل العملية.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="w-16 h-16 bg-brand-light/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                          <FileText size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">PDF وملازم</h3>
                      <p className="text-gray-600">مذكرات منظمة للمحاسبة وقواعد البيانات تغنيك عن الكتاب.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="w-16 h-16 bg-brand-light/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                          <ShieldCheck size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">ضمان الامتياز</h3>
                      <p className="text-gray-600">امتحانات سابقة محلولة وتدريبات على شكل ورقة الامتحان النهائية.</p>
                  </div>
               </div>
               
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-brand-dark">أحدث المواد المضافة</h2>
                 <button onClick={() => setView('courses')} className="text-brand-primary font-bold hover:underline">عرض الكل</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {courses.slice(0, 3).map(course => (
                   <CourseCard key={course.id} course={course} onView={openCourse} isSubscribed={!!user?.isSubscribed} />
                 ))}
               </div>
            </div>
          </>
        )}

        {view === 'courses' && <CoursesView />}
        
        {view === 'course_detail' && <CourseDetailView />}
        
        {view === 'dashboard' && <DashboardView />}
      </main>

      <footer className="bg-brand-dark text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-brand-gold" size={32} />
                    <span className="text-3xl font-bold">Master Bis</span>
                </div>
                <p className="text-gray-400 max-w-sm leading-relaxed">
                    منصتك الأولى للتميز في الفرقة الثانية BIS. نحن نسهل عليك مواد قواعد البيانات والمحاسبة والإنتاج.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4 text-brand-gold">روابط سريعة</h4>
                <ul className="space-y-2 text-gray-300">
                    <li><button onClick={() => setView('home')} className="hover:text-white transition">الرئيسية</button></li>
                    <li><button onClick={() => setView('courses')} className="hover:text-white transition">المواد الدراسية</button></li>
                    <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white transition">تسجيل الدخول</button></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4 text-brand-gold">تواصل معنا</h4>
                <ul className="space-y-2 text-gray-300">
                    <li>دعم فني: {VODAFONE_CASH_NUMBER}</li>
                    <li>البريد: support@masterbis.com</li>
                    <li>العنوان: القاهرة، مصر</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            © 2024 Master Bis. جميع الحقوق محفوظة.
        </div>
      </footer>

      {showLoginModal && <LoginModal />}
      {showSubModal && <SubscriptionModal />}
    </div>
  );
}