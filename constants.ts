import { Course, MaterialType } from './types';

export const VODAFONE_CASH_NUMBER = "01004790502";
export const SUBSCRIPTION_PRICE = "100 جنيه";

export const MOCK_COURSES: Course[] = [
  {
    id: 'db2',
    title: 'قواعد البيانات (Database)',
    description: 'شرح شامل لمنهج قواعد البيانات، SQL Server، تصميم الجداول، والـ Normalization.',
    instructor: 'د. محمد كمال',
    thumbnail: 'https://images.unsplash.com/photo-1544383225-681c8382cf56?q=80&w=1000&auto=format&fit=crop',
    materials: [
      { id: 'db_m1', title: 'المحاضرة 1: مفاهيم Database Management', type: MaterialType.VIDEO, isFree: true, url: '#', duration: '45:00' },
      { id: 'db_m2', title: 'المحاضرة 2: شرح ERD بالتفصيل', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '55:00' },
      { id: 'db_m3', title: 'Mapping ERD to Schema', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '60:00' },
      { id: 'db_m4', title: 'أوامر SQL: DDL & DML', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '50:00' },
      { id: 'db_pdf1', title: 'ملخص رسومات ERD', type: MaterialType.PDF, isFree: false, url: '#' },
    ]
  },
  {
    id: 'acc2',
    title: 'محاسبة شركات (Corporate Accounting)',
    description: 'كل ما يخص محاسبة الشركات: تكوين الشركات، الأسهم، السندات، وتصفية الشركات.',
    instructor: 'د. أحمد محمود',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-98406858d0cb?q=80&w=1000&auto=format&fit=crop',
    materials: [
      { id: 'acc_m1', title: 'تكوين شركات الأموال (الأسهم)', type: MaterialType.VIDEO, isFree: true, url: '#', duration: '40:00' },
      { id: 'acc_m2', title: 'المعلاجة المحاسبية لإصدار السندات', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '50:00' },
      { id: 'acc_m3', title: 'مسائل تصفية الشركات', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '65:00' },
      { id: 'acc_pdf1', title: 'تمارين محلولة على الأسهم', type: MaterialType.PDF, isFree: false, url: '#' },
      { id: 'acc_quiz1', title: 'امتحان على جزء الأسهم والسندات', type: MaterialType.QUIZ, isFree: false, url: '#' },
    ]
  },
  {
    id: 'prod2',
    title: 'مسائل إدارة الإنتاج (Production Mgt)',
    description: 'شرح العملي والمسائل: التنبؤ بالطلب، اختيار الموقع، ونظم الإنتاج.',
    instructor: 'م. سارة علي',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
    materials: [
      { id: 'pm_m1', title: 'مسائل التنبؤ بالطلب (Forecasting)', type: MaterialType.VIDEO, isFree: true, url: '#', duration: '35:00' },
      { id: 'pm_m2', title: 'نقطة التعادل (Break-Even Analysis)', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '45:00' },
      { id: 'pm_m3', title: 'مسائل اختيار موقع المشروع', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '40:00' },
      { id: 'pm_m4', title: 'تخطيط الطاقة الإنتاجية', type: MaterialType.VIDEO, isFree: false, url: '#', duration: '50:00' },
      { id: 'pm_pdf1', title: 'قوانين إدارة الإنتاج في ورقة واحدة', type: MaterialType.PDF, isFree: true, url: '#' },
    ]
  }
];