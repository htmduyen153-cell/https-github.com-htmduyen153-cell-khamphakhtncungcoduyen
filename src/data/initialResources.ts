import { ResourceItem } from '../types';

// Dữ liệu học liệu mẫu ban đầu từ hệ thống của Cô Duyên
export const SEED_RESOURCES: ResourceItem[] = [
  {
    id: 'res-8-30-1',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'model3d',
    title: 'Mô hình 3D: Toàn bộ hệ cơ quan nội tạng người',
    desc: 'Mô hình xoay 360 độ tương tác, bóc tách quan sát vị trí của tim, phổi, gan, dạ dày trong khoang ngực và bụng.',
    link: 'https://human.biodigital.com',
    fileName: 'So-do-khoang-than-the-nguoi.pdf',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-2',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'mindmap',
    title: 'Mindmap: Sơ đồ phối hợp các hệ cơ quan cơ thể người',
    desc: 'Tổng hợp sơ đồ thể hiện sự phối hợp nhịp nhàng giữa hệ thần kinh, nội tiết cùng hệ tuần hoàn, tiêu hóa, hô hấp.',
    link: '',
    fileName: 'Mindmap-Bai30-Cothe-nguoi.png',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-3',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'exercise',
    title: 'Phiếu học tập: Nhận diện cơ quan và hệ cơ quan',
    desc: 'Bộ 15 câu hỏi trắc nghiệm khách quan và bài tập ghép nối chức năng của từng cơ quan chính.',
    link: '',
    fileName: 'Phieu-bai-tap-Bai30-KHTN8.docx',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-4',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'game',
    title: 'Trò chơi: Đố vui sắp xếp cơ quan vào đúng hệ',
    desc: 'Thử thách kéo thả các cơ quan: Dạ dày, Phổi, Thận, Tim, Não vào đúng hệ cơ quan tương ứng.',
    link: 'https://wordwall.net',
    fileName: '',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-33-1',
    lessonId: 'b8-33',
    grade: 8,
    subcat: 'model3d',
    title: 'Mô hình 3D: Cấu tạo 4 ngăn tim và van tim',
    desc: 'Khảo sát động học 4 ngăn tim (2 tâm thất, 2 tâm nhĩ) và van nhĩ thất, van động mạch khi co bóp.',
    link: 'https://sketchfab.com/3d-models/human-heart-animated-3d-model',
    fileName: 'Mo-hinh-tim-3D-KHTN8.pdf',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-33-2',
    lessonId: 'b8-33',
    grade: 8,
    subcat: 'virtual_lab',
    title: 'Thí nghiệm mô phỏng: Đường đi máu vòng tuần hoàn lớn & nhỏ',
    desc: 'Theo dõi sự thay đổi màu sắc máu giàu O2 (đỏ tươi) và máu giàu CO2 (đỏ thẫm) qua các mao mạch.',
    link: 'https://vlab.amrita.edu',
    fileName: '',
    createdAt: '2026-10-10'
  }
];
