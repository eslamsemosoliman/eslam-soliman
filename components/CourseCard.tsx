import React from 'react';
import { PlayCircle, FileText, Lock } from 'lucide-react';
import { Course } from '../types';
import { Button } from './Button';

interface CourseCardProps {
  course: Course;
  onView: (course: Course) => void;
  isSubscribed: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onView, isSubscribed }) => {
  const videoCount = course.materials.filter(m => m.type === 'VIDEO').length;
  const pdfCount = course.materials.filter(m => m.type === 'PDF').length;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {!isSubscribed && (
          <div className="absolute top-2 right-2 bg-brand-gold text-brand-text text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
            <Lock size={12} /> محتوى مدفوع
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-brand-dark mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <PlayCircle size={16} className="text-brand-primary" />
            <span>{videoCount} فيديو</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={16} className="text-brand-primary" />
            <span>{pdfCount} ملف</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => onView(course)}
          >
            عرض المحتوى
          </Button>
        </div>
      </div>
    </div>
  );
};