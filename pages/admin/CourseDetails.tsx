import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';

const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { courses, departments, addCourse, updateCourse, users, professorCourseAssignments, assignProfessorToCourse } = useData();
    const isNew = id === 'new';

    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [credits, setCredits] = useState(3);
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState('بكالوريوس علوم الحاسوب');
    const [prerequisites, setPrerequisites] = useState<{id: number; name: string; description: string}[]>([]);
    const [professorId, setProfessorId] = useState<string | null>(null);

    const professors = users.filter(u => u.role === 'professor');

    useEffect(() => {
        if (!isNew && id) {
            const course = courses.find(c => c.id === id);
            if (course) {
                setCourseName(course.name);
                setCourseCode(course.code);
                setCredits(course.credits);
                setDepartment(course.department);
                setProgram(course.program);
                setPrerequisites(course.prerequisites.map((p, i) => ({ id: i, name: p, description: `متطلب سابق لمادة ${p}` })));
                
                const assignment = professorCourseAssignments.find(a => a.courseId === id);
                if (assignment) {
                    setProfessorId(assignment.professorId);
                } else {
                    setProfessorId(null);
                }
            }
        } else if (isNew && departments.length > 0) {
            setDepartment(departments[0].id);
        }
    }, [id, isNew, courses, professorCourseAssignments, departments]);

    const addPrerequisite = () => {
        setPrerequisites([...prerequisites, { id: Date.now(), name: '', description: '' }]);
    };

    const removePrerequisite = (prereqId: number) => {
        setPrerequisites(prerequisites.filter(p => p.id !== prereqId));
    };

    const handleSave = () => {
        const courseData = {
            code: courseCode,
            name: courseName,
            credits: credits,
            department: department,
            prerequisites: prerequisites.map(p => p.name).filter(p => p),
            program: program,
        };

        if (isNew) {
            addCourse(courseData, professorId);
        } else if (id) {
            updateCourse({ id, ...courseData });
            assignProfessorToCourse(id, professorId);
        }
        navigate('/admin/courses');
    };

    return (
        <AdminLayout title={isNew ? 'إضافة مقرر جديد' : 'تعديل بيانات المادة'}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">معلومات أساسية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المادة</label>
                            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رمز المادة</label>
                            <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الوحدات</label>
                            <input type="number" value={credits} onChange={(e) => setCredits(parseInt(e.target.value))} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وصف مختصر</label>
                            <input type="text" placeholder="مادة متقدمة تركز على مبادئ..." className="w-full p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full p-2 border rounded-md bg-white"
                                aria-label="القسم"
                            >
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">أستاذ المادة</label>
                            <select
                                value={professorId || ''}
                                onChange={(e) => setProfessorId(e.target.value || null)}
                                className="w-full p-2 border rounded-md bg-white"
                                aria-label="أستاذ المادة"
                            >
                                <option value="">غير مسند</option>
                                {professors.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {!isNew && (
                    <>
                        {/* Detailed Description */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">الوصف التفصيلي</h2>
                            <textarea placeholder="اكتب وصفا شاملاً للمادة..." rows={6} className="w-full p-2 border rounded-md"></textarea>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">المتطلبات السابقة</h2>
                            <div className="space-y-4">
                                {prerequisites.map((prereq, index) => (
                                    <div key={prereq.id} className="border p-4 rounded-md bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold">{prereq.name || 'متطلب جديد'}</h3>
                                            <button onClick={() => removePrerequisite(prereq.id)} className="text-red-500 hover:text-red-700">حذف</button>
                                        </div>
                                        <div className="space-y-2">
                                            <input 
                                              type="text" 
                                              value={prereq.name} 
                                              onChange={(e) => {
                                                const newPrereqs = [...prerequisites];
                                                newPrereqs[index].name = e.target.value;
                                                setPrerequisites(newPrereqs);
                                              }}
                                              placeholder="رمز المتطلب (e.g. CS101)" 
                                              className="w-full p-2 border rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addPrerequisite} className="mt-4 text-blue-600 font-semibold">+ إضافة متطلب سابق</button>
                        </div>
                    </>
                )}

                <div className="flex justify-end space-x-4 space-x-reverse">
                    <button onClick={() => navigate('/admin/courses')} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">إلغاء</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        {isNew ? 'إضافة المقرر' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CourseDetails;