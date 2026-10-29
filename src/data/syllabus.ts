import { GradeNumber, Lesson } from '../types';

export const MASTER_SYLLABUS: Record<GradeNumber, Lesson[]> = {
  // =========================================================================
  // KHOA HỌC TỰ NHIÊN 6
  // =========================================================================
  6: [
    // Chương V. Tế bào
    {
      id: 'b6-18',
      grade: 6,
      topic: 'Chương V. Tế bào',
      code: 'Bài 18',
      title: 'Tế bào – Đơn vị cơ bản của sự sống',
      yccd: 'Nêu được khái niệm tế bào; nhận biết được màng sinh chất, chất tế bào, nhân hoặc vùng nhân; giải thích được vì sao tế bào là đơn vị cơ bản cấu tạo nên mọi cơ thể sống.',
      keyConcepts: ['Tế bào', 'Đơn vị cơ bản của sự sống', 'Màng sinh chất', 'Chất tế bào', 'Nhân tế bào', 'Vùng nhân']
    },
    {
      id: 'b6-19',
      grade: 6,
      topic: 'Chương V. Tế bào',
      code: 'Bài 19',
      title: 'Cấu tạo và chức năng các thành phần của tế bào',
      yccd: 'Mô tả được cấu tạo và chức năng các thành phần chính của tế bào; phân biệt được tế bào nhân sơ và tế bào nhân thực, tế bào thực vật và tế bào động vật.',
      keyConcepts: ['Màng sinh chất', 'Tế bào chất', 'Nhân tế bào', 'Thành tế bào', 'Lục lạp', 'Tế bào nhân sơ', 'Tế bào nhân thực']
    },
    {
      id: 'b6-20',
      grade: 6,
      topic: 'Chương V. Tế bào',
      code: 'Bài 20',
      title: 'Sự lớn lên và sinh sản của tế bào',
      yccd: 'Nêu được sự lớn lên và phân chia (sinh sản) của tế bào; giải thích được ý nghĩa của sự lớn lên và phân chia tế bào đối với sự lớn lên của cơ thể sinh vật.',
      keyConcepts: ['Lớn lên của tế bào', 'Phân chia tế bào', 'Sinh sản tế bào', 'Ý nghĩa sinh học']
    },
    {
      id: 'b6-21',
      grade: 6,
      topic: 'Chương V. Tế bào',
      code: 'Bài 21',
      title: 'Thực hành quan sát và phân biệt một số loại tế bào',
      yccd: 'Thực hiện được các bước làm tiêu bản tạm thời tế bào thực vật (vảy hành) và tế bào động vật (trứng cá); sử dụng kính hiển vi quang học quan sát và phân biệt các loại tế bào.',
      keyConcepts: ['Tiêu bản tạm thời', 'Kính hiển vi quang học', 'Tế bào vảy hành', 'Tế bào trứng cá', 'Thị kính', 'Vật kính']
    },

    // Chương VI. Từ tế bào đến cơ thể
    {
      id: 'b6-22',
      grade: 6,
      topic: 'Chương VI. Từ tế bào đến cơ thể',
      code: 'Bài 22',
      title: 'Cơ thể sinh vật',
      yccd: 'Nêu được khái niệm cơ thể sinh vật; phân biệt được cơ thể đơn bào (trùng roi, vi khuẩn) và cơ thể đa bào (cây hoa mai, con mèo, con người).',
      keyConcepts: ['Cơ thể sinh vật', 'Sinh vật đơn bào', 'Sinh vật đa bào', 'Trùng giày', 'Trùng biến hình']
    },
    {
      id: 'b6-23',
      grade: 6,
      topic: 'Chương VI. Từ tế bào đến cơ thể',
      code: 'Bài 23',
      title: 'Tổ chức cơ thể đa bào',
      yccd: 'Trình bày được các cấp độ tổ chức sống trong cơ thể đa bào từ thấp đến cao: Tế bào -> Mô -> Cơ quan -> Hệ cơ quan -> Cơ thể.',
      keyConcepts: ['Cấp độ tổ chức', 'Mô', 'Cơ quan', 'Hệ cơ quan', 'Cơ thể hoàn chỉnh']
    },
    {
      id: 'b6-24',
      grade: 6,
      topic: 'Chương VI. Từ tế bào đến cơ thể',
      code: 'Bài 24',
      title: 'Thực hành quan sát và mô tả cơ thể đơn bào, đa bào',
      yccd: 'Làm được tiêu bản giọt nước ao hồ, quan sát mô tả hình dạng chuyển động của sinh vật đơn bào và nhận biết cấu tạo mô, cơ quan trong cơ thể đa bào.',
      keyConcepts: ['Nước ao hồ', 'Trùng roi xanh', 'Trùng giày', 'Kính hiển vi', 'Mô thực vật']
    },

    // Chương VII. Đa dạng thế giới sống
    {
      id: 'b6-25',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 25',
      title: 'Hệ thống phân loại sinh vật',
      yccd: 'Nêu được sự cần thiết của việc phân loại sinh vật; nhận biết được sơ đồ 5 giới sinh vật và các bậc phân loại từ nhỏ đến lớn: Loài, Chi, Họ, Bộ, Lớp, Ngành, Giới.',
      keyConcepts: ['Phân loại sinh học', '5 giới sinh vật', 'Bậc phân loại', 'Loài', 'Tên khoa học']
    },
    {
      id: 'b6-26',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 26',
      title: 'Khoá lưỡng phân',
      yccd: 'Hiểu được nguyên tắc xây dựng khóa lưỡng phân; tự lập và sử dụng được khóa lưỡng phân đơn giản để phân loại một số sinh vật quen thuộc.',
      keyConcepts: ['Khóa lưỡng phân', 'Cặp đặc điểm đối lập', 'Tiêu chí phân loại']
    },
    {
      id: 'b6-27',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 27',
      title: 'Vi khuẩn',
      yccd: 'Mô tả được hình dạng và cấu tạo tế bào nhân sơ của vi khuẩn; nêu được vai trò của vi khuẩn trong tự nhiên, thực tiễn và một số bệnh do vi khuẩn gây ra.',
      keyConcepts: ['Vi khuẩn', 'Tế bào nhân sơ', 'Lợi khuẩn', 'Vi khuẩn gây bệnh', 'Kháng sinh']
    },
    {
      id: 'b6-28',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 28',
      title: 'Thực hành làm sữa chua và quan sát vi khuẩn',
      yccd: 'Thực hiện được quy trình làm sữa chua tại nhà bằng quá trình lên men lactic của vi khuẩn; quan sát vi khuẩn lactic trên tiêu bản nhuộm.',
      keyConcepts: ['Lên men lactic', 'Vi khuẩn lactic (Lactobacillus)', 'Làm sữa chua', 'Vệ sinh an toàn']
    },
    {
      id: 'b6-29',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 29',
      title: 'Virus',
      yccd: 'Mô tả được cấu tạo đơn giản của virus (vỏ protein và lõi axit nucleic); giải thích được vì sao virus chưa có cấu tạo tế bào; nêu các con đường lây truyền và biện pháp phòng chống bệnh do virus.',
      keyConcepts: ['Virus', 'Vỏ capsid', 'Axit nucleic', 'Ký sinh nội bào', 'Vaccine', 'Phòng chống dịch bệnh']
    },
    {
      id: 'b6-30',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 30',
      title: 'Nguyên sinh vật',
      yccd: 'Nhận biết được một số nguyên sinh vật điển hình (trùng roi, trùng biến hình, trùng giày, tảo lục); nêu được vai trò và một số bệnh do nguyên sinh vật gây ra (sốt rét, kiết lị).',
      keyConcepts: ['Nguyên sinh vật', 'Trùng sốt rét', 'Trùng kiết lị', 'Tảo đơn bào', 'Muỗi Anopheles']
    },
    {
      id: 'b6-31',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 31',
      title: 'Thực hành quan sát nguyên sinh vật',
      yccd: 'Thực hiện thao tác lấy mẫu nước đọng, ao hồ, soi dưới kính hiển vi quang học; nhận diện và vẽ hình nguyên sinh vật quan sát được.',
      keyConcepts: ['Mẫu nước ao', 'Kính hiển vi quang học', 'Quan sát tế bào sống', 'Vận động của trùng roi']
    },
    {
      id: 'b6-32',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 32',
      title: 'Nấm',
      yccd: 'Nhận biết được đặc điểm cấu tạo của nấm (nấm đơn bào, nấm đa bào); phân biệt nấm ăn được, nấm độc, nấm mốc; nêu vai trò và tác hại của nấm trong tự nhiên và đời sống.',
      keyConcepts: ['Nấm', 'Nấm men', 'Nấm mốc', 'Nấm rơm', 'Nấm độc', 'Dinh dưỡng dị dưỡng']
    },
    {
      id: 'b6-33',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 33',
      title: 'Thực hành quan sát các loại nấm',
      yccd: 'Quan sát cấu tạo thể quả của nấm rơm, nấm sò; quan sát sợi nấm mốc dưới kính lúp hoặc kính hiển vi; phân biệt được các bộ phận chính của cây nấm.',
      keyConcepts: ['Thể quả nấm', 'Mũ nấm', 'Cuống nấm', 'Bào tử nấm', 'Bào tử đảm']
    },
    {
      id: 'b6-34',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 34',
      title: 'Thực vật',
      yccd: 'Phân biệt được 4 nhóm thực vật chính: Rêu, Dương xỉ, Hạt trần, Hạt kín qua các tiêu chí có mạch dẫn hay không, sinh sản bằng bào tử hay hạt, hạt nằm trong quả hay không.',
      keyConcepts: ['Thực vật', 'Ngành Rêu', 'Dương xỉ', 'Hạt trần', 'Hạt kín', 'Mạch dẫn']
    },
    {
      id: 'b6-35',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 35',
      title: 'Thực hành quan sát và phân biệt một số nhóm thực vật',
      yccd: 'Quan sát mẫu vật thật cây rêu, cây dương xỉ, cành thông, cây có hoa; xác định các cơ quan sinh dưỡng và cơ quan sinh sản của từng nhóm thực vật.',
      keyConcepts: ['Mẫu vật thật', 'Túi bào tử', 'Nón thông', 'Hoa và quả', 'Thực vật hạt kín']
    },
    {
      id: 'b6-36',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 36',
      title: 'Động vật',
      yccd: 'Phân biệt được động vật không xương sống (ruột khoang, giun, thân mềm, chân khớp) và động vật có xương sống (cá, lưỡng cư, bò sát, chim, thú); nêu đặc điểm thích nghi của từng nhóm.',
      keyConcepts: ['Động vật không xương sống', 'Động vật có xương sống', 'Chân khớp', 'Động vật biến nhiệt', 'Động vật đẳng nhiệt']
    },
    {
      id: 'b6-37',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 37',
      title: 'Thực hành quan sát và nhận biết một số nhóm động vật ngoài thiên nhiên',
      yccd: 'Quan sát động vật tại vườn trường hoặc công viên; ghi chép tập tính, môi trường sống và phân loại chúng vào các nhóm động vật tương ứng.',
      keyConcepts: ['Quan sát thiên nhiên', 'Tập tính động vật', 'Môi trường sống', 'Nhận dạng động vật']
    },
    {
      id: 'b6-38',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 38',
      title: 'Đa dạng sinh học',
      yccd: 'Trình bày được vai trò của đa dạng sinh học đối với tự nhiên và con người; phân tích được các nguyên nhân làm suy giảm đa dạng sinh học và các giải pháp bảo vệ.',
      keyConcepts: ['Đa dạng loài', 'Đa dạng hệ sinh thái', 'Sách đỏ', 'Bảo tồn đa dạng sinh học']
    },
    {
      id: 'b6-39',
      grade: 6,
      topic: 'Chương VII. Đa dạng thế giới sống',
      code: 'Bài 39',
      title: 'Tìm hiểu sinh vật ngoài thiên nhiên',
      yccd: 'Thực hiện chuyến dã ngoại tìm hiểu thế giới sinh vật quanh trường/địa phương; làm bộ sưu tập ảnh hoặc mẫu vật ép; báo cáo kết quả khảo sát sinh vật.',
      keyConcepts: ['Khảo sát thực địa', 'Sinh vật bản địa', 'Mẫu vật tiêu bản', 'Bảo vệ môi trường sống']
    }
  ],

  // =========================================================================
  // KHOA HỌC TỰ NHIÊN 7
  // =========================================================================
  7: [
    // Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật
    {
      id: 'b7-21',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 21',
      title: 'Khái quát về trao đổi chất và chuyển hoá năng lượng',
      yccd: 'Nêu được khái niệm trao đổi chất và chuyển hoá năng lượng; phân tích vai trò thiết yếu của trao đổi chất đối với sự tồn tại và phát triển của sinh vật.',
      keyConcepts: ['Trao đổi chất', 'Chuyển hóa năng lượng', 'Đồng hóa', 'Dị hóa', 'Năng lượng ATP']
    },
    {
      id: 'b7-22',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 22',
      title: 'Quang hợp ở thực vật',
      yccd: 'Mô tả được phương trình tổng quát của quang hợp; nêu vai trò của lục lạp, diệp lục, ánh sáng, nước và khí CO2 trong quá trình chế tạo chất hữu cơ và giải phóng O2.',
      keyConcepts: ['Quang hợp', 'Lục lạp', 'Diệp lục', 'Khí cacbonic', 'Khí oxi', 'Glucose', 'Năng lượng ánh sáng']
    },
    {
      id: 'b7-23',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 23',
      title: 'Một số yếu tố ảnh hưởng đến quang hợp',
      yccd: 'Phân tích được ảnh hưởng của ánh sáng, nồng độ CO2, nước, nhiệt độ đến cường độ quang hợp; vận dụng trong trồng trọt nâng cao năng suất cây trồng.',
      keyConcepts: ['Cường độ quang hợp', 'Điểm bão hòa ánh sáng', 'Nhiệt độ', 'Nồng độ CO2', 'Năng suất cây trồng']
    },
    {
      id: 'b7-24',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 24',
      title: 'Thực hành chứng minh quang hợp ở cây xanh',
      yccd: 'Thực hiện được thí nghiệm chứng minh tinh bột được tạo thành trong quang hợp và khí oxi được giải phóng khi có ánh sáng.',
      keyConcepts: ['Thí nghiệm quang hợp', 'Thuốc thử Lugol (Iot)', 'Khí Oxi', 'Thử tinh bột ở lá']
    },
    {
      id: 'b7-25',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 25',
      title: 'Hô hấp tế bào',
      yccd: 'Mô tả được khái niệm hô hấp tế bào; viết phương trình hô hấp tế bào phân giải glucose giải phóng năng lượng ATP; nêu vai trò của ty thể.',
      keyConcepts: ['Hô hấp tế bào', 'Ty thể', 'Phân giải chất hữu cơ', 'Năng lượng ATP', 'Khí carbonic và hơi nước']
    },
    {
      id: 'b7-26',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 26',
      title: 'Một số yếu tố ảnh hưởng đến hô hấp tế bào',
      yccd: 'Nêu các yếu tố ảnh hưởng đến hô hấp tế bào (nước, nhiệt độ, hàm lượng O2, CO2); giải thích cơ sở khoa học của việc bảo quản nông sản, hạt giống.',
      keyConcepts: ['Cường độ hô hấp', 'Bảo quản nông sản', 'Hàm lượng nước', 'Nhiệt độ bảo quản', 'Khí quyển điều chỉnh']
    },
    {
      id: 'b7-27',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 27',
      title: 'Thực hành hô hấp ở thực vật',
      yccd: 'Thực hiện được thí nghiệm chứng minh hạt nảy mầm hút khí oxi, thải khí cacbonic và tỏa nhiệt trong quá trình hô hấp tế bào.',
      keyConcepts: ['Hạt nảy mầm', 'Nước vôi trong', 'Hô hấp tỏa nhiệt', 'Nhiệt kế thí nghiệm']
    },
    {
      id: 'b7-28',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 28',
      title: 'Trao đổi khí ở sinh vật',
      yccd: 'Trình bày cơ chế trao đổi khí qua khí khổng ở lá cây và qua bề mặt cơ thể, hệ thống ống khí, mang, phổi ở các nhóm động vật.',
      keyConcepts: ['Trao đổi khí', 'Khí khổng', 'Cơ chế đóng mở khí khổng', 'Phổi', 'Mang', 'Ống khí']
    },
    {
      id: 'b7-29',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 29',
      title: 'Vai trò của nước và chất dinh dưỡng đối với sinh vật',
      yccd: 'Nêu được thành phần hóa học của nước và các chất dinh dưỡng; phân tích vai trò cấu trúc và điều hòa của nước và chất khoáng đối với cơ thể sống.',
      keyConcepts: ['Dung môi sinh học', 'Nước trong cơ thể', 'Chất dinh dưỡng', 'Nguyên tố khoáng thiết yếu']
    },
    {
      id: 'b7-30',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 30',
      title: 'Trao đổi nước và chất dinh dưỡng ở thực vật',
      yccd: 'Mô tả được con đường hấp thụ nước và khoáng từ lông hút vào rễ, vận chuyển theo dòng mạch gỗ lên thân lá, và sự thoát hơi nước qua khí khổng.',
      keyConcepts: ['Lông hút rễ', 'Mạch gỗ (xylem)', 'Mạch rây (phloem)', 'Thoát hơi nước', 'Động lực dòng mạch gỗ']
    },
    {
      id: 'b7-31',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 31',
      title: 'Trao đổi nước và chất dinh dưỡng ở động vật',
      yccd: 'Mô tả được các giai đoạn tiêu hóa thức ăn, hấp thụ chất dinh dưỡng, tuần hoàn máu vận chuyển dưỡng chất và bài tiết chất cặn bã ở động vật.',
      keyConcepts: ['Hệ tiêu hóa', 'Hấp thụ dưỡng chất', 'Hệ tuần hoàn', 'Hệ bài tiết', 'Cân bằng nội môi']
    },
    {
      id: 'b7-32',
      grade: 7,
      topic: 'Chương VII. Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
      code: 'Bài 32',
      title: 'Thực hành chứng minh thân vận chuyển nước và lá thoát hơi nước',
      yccd: 'Làm được thí nghiệm cắm cành hoa/cành cần tây vào nước màu để quan sát dòng vận chuyển trong thân và dùng túi nilon bọc cành lá chứng minh sự thoát hơi nước.',
      keyConcepts: ['Thí nghiệm nước màu', 'Vết cắt thân cây', 'Mạch gỗ', 'Túi nilon bọc lá', 'Giọt nước ngưng tụ']
    },

    // Chương VIII. Cảm ứng ở sinh vật
    {
      id: 'b7-33',
      grade: 7,
      topic: 'Chương VIII. Cảm ứng ở sinh vật',
      code: 'Bài 33',
      title: 'Cảm ứng ở sinh vật và tập tính ở động vật',
      yccd: 'Nêu được định nghĩa cảm ứng ở sinh vật; lấy ví dụ về hướng sáng, hướng nước, hướng tiếp xúc ở cây và phân biệt tập tính bẩm sinh với tập tính học được ở động vật.',
      keyConcepts: ['Cảm ứng', 'Hướng động ở thực vật', 'Tập tính bẩm sinh', 'Tập tính học được', 'Tập tính động vật']
    },
    {
      id: 'b7-34',
      grade: 7,
      topic: 'Chương VIII. Cảm ứng ở sinh vật',
      code: 'Bài 34',
      title: 'Vận dụng hiện tượng cảm ứng ở sinh vật vào thực tiễn',
      yccd: 'Vận dụng kiến thức cảm ứng để giải thích việc làm giàn cho cây leo, chiếu sáng kích thích cây ra hoa và huấn luyện động vật trong chăn nuôi, an ninh.',
      keyConcepts: ['Ứng dụng cảm ứng', 'Giàn cây leo', 'Chiếu sáng nhân tạo', 'Huấn luyện vật nuôi']
    },
    {
      id: 'b7-35',
      grade: 7,
      topic: 'Chương VIII. Cảm ứng ở sinh vật',
      code: 'Bài 35',
      title: 'Thực hành cảm ứng ở sinh vật',
      yccd: 'Thiết kế và thực hiện thí nghiệm chứng minh tính hướng sáng (cây mọc nghiêng về phía có ánh sáng), tính hướng trọng lực của rễ cây và phản ứng khép lá của cây trinh nữ.',
      keyConcepts: ['Hướng sáng', 'Hướng trọng lực', 'Cây trinh nữ', 'Thí nghiệm cảm ứng']
    },

    // Chương IX. Sinh trưởng và phát triển ở sinh vật
    {
      id: 'b7-36',
      grade: 7,
      topic: 'Chương IX. Sinh trưởng và phát triển ở sinh vật',
      code: 'Bài 36',
      title: 'Khái quát về sinh trưởng và phát triển ở sinh vật',
      yccd: 'Phân biệt được sinh trưởng và phát triển; mô tả các giai đoạn sinh trưởng và phát triển điển hình ở thực vật có hoa và động vật (biến thái hoàn toàn, không hoàn toàn).',
      keyConcepts: ['Sinh trưởng', 'Phát triển', 'Mô phân sinh', 'Biến thái hoàn toàn (Bướm)', 'Biến thái không hoàn toàn (Châu chấu)']
    },
    {
      id: 'b7-37',
      grade: 7,
      topic: 'Chương IX. Sinh trưởng và phát triển ở sinh vật',
      code: 'Bài 37',
      title: 'Ứng dụng sinh trưởng và phát triển ở sinh vật vào thực tiễn',
      yccd: 'Vận dụng hiểu biết về các yếu tố ảnh hưởng (nhiệt độ, ánh sáng, dinh dưỡng) để điều khiển sinh trưởng và phát triển của cây trồng, vật nuôi nhằm đạt hiệu quả kinh tế cao.',
      keyConcepts: ['Điều hòa sinh trưởng', 'Kích thích ra rễ', 'Thắp đèn thanh long', 'Vỗ béo gia súc gia cầm']
    },
    {
      id: 'b7-38',
      grade: 7,
      topic: 'Chương IX. Sinh trưởng và phát triển ở sinh vật',
      code: 'Bài 38',
      title: 'Thực hành quan sát, mô tả sự sinh trưởng và phát triển ở một số sinh vật',
      yccd: 'Gieo hạt đậu và ghi nhật ký theo dõi sự sinh trưởng (chiều cao, số lá) của cây; quan sát tiêu bản hoặc video vòng đời của ếch, bướm.',
      keyConcepts: ['Nhật ký sinh trưởng', 'Đo chiều cao cây', 'Vòng đời của ếch', 'Vòng đời sâu bướm']
    },

    // Chương X. Sinh sản ở sinh vật
    {
      id: 'b7-39',
      grade: 7,
      topic: 'Chương X. Sinh sản ở sinh vật',
      code: 'Bài 39',
      title: 'Sinh sản vô tính ở sinh vật',
      yccd: 'Nêu được khái niệm sinh sản vô tính; phân biệt sinh sản sinh dưỡng tự nhiên (rễ củ, thân bò, thân rễ) và nhân tạo (giâm, chiết, ghép cành, nuôi cấy mô).',
      keyConcepts: ['Sinh sản vô tính', 'Sinh sản sinh dưỡng', 'Giâm cành', 'Chiết cành', 'Ghép cành', 'Nuôi cấy mô tế bào']
    },
    {
      id: 'b7-40',
      grade: 7,
      topic: 'Chương X. Sinh sản ở sinh vật',
      code: 'Bài 40',
      title: 'Sinh sản hữu tính ở sinh vật',
      yccd: 'Mô tả cấu tạo hoa lưỡng tính; quá trình thụ phấn, thụ tinh, hình thành quả và hạt ở thực vật; quá trình thụ tinh và sinh sản ở động vật.',
      keyConcepts: ['Sinh sản hữu tính', 'Cấu tạo hoa', 'Thụ phấn', 'Thụ tinh kép', 'Giao tử đực và cái', 'Trứng và tinh trùng']
    },
    {
      id: 'b7-41',
      grade: 7,
      topic: 'Chương X. Sinh sản ở sinh vật',
      code: 'Bài 41',
      title: 'Một số yếu tố ảnh hưởng và điều hoà, điều khiển sinh sản ở sinh vật',
      yccd: 'Phân tích các yếu tố môi trường (ánh sáng, nhiệt độ, độ ẩm) và hormone tác động đến sinh sản; trình bày các ứng dụng điều khiển sinh sản (thụ tinh nhân tạo, ấp trứng nhân tạo).',
      keyConcepts: ['Điều khiển sinh sản', 'Thụ tinh nhân tạo', 'Hormone sinh sản', 'Kỹ thuật ấp trứng', 'Bảo quản giao tử']
    },
    {
      id: 'b7-42',
      grade: 7,
      topic: 'Chương X. Sinh sản ở sinh vật',
      code: 'Bài 42',
      title: 'Cơ thể sinh vật là một thể thống nhất',
      yccd: 'Chứng minh được mối quan hệ thống nhất biện chứng giữa tế bào - mô - cơ quan - hệ cơ quan và giữa các hoạt động sống (trao đổi chất, cảm ứng, sinh trưởng, sinh sản).',
      keyConcepts: ['Thể thống nhất', 'Mối liên hệ cấu trúc - chức năng', 'Điều hòa tích hợp', 'Hệ thống mở tự điều chỉnh']
    }
  ],

  // =========================================================================
  // KHOA HỌC TỰ NHIÊN 8
  // =========================================================================
  8: [
    // Chương VII. Sinh học cơ thể người
    {
      id: 'b8-30',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 30',
      title: 'Khái quát về cơ thể người',
      yccd: 'Nhận biết được các phần chính của cơ thể người (đầu, thân, chi); gọi tên và xác định vị trí của các hệ cơ quan nội tạng chính trong khoang ngực và khoang bụng.',
      keyConcepts: ['Hệ cơ quan người', 'Khoang ngực', 'Khoang bụng', 'Cơ hoành', 'Nội môi', 'Điều hòa thần kinh và thể dịch']
    },
    {
      id: 'b8-31',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 31',
      title: 'Hệ vận động ở người',
      yccd: 'Mô tả được cấu tạo và chức năng của bộ xương (xương đầu, xương thân, xương chi) và hệ cơ; giải thích cơ chế cử động; nêu các bệnh học đường (cong vẹo cột sống) và cách phòng tránh.',
      keyConcepts: ['Bộ xương người', 'Khớp xương', 'Cơ vân', 'Cong vẹo cột sống', 'Gãy xương', 'Tư thế học đường đúng']
    },
    {
      id: 'b8-32',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 32',
      title: 'Dinh dưỡng và tiêu hoá ở người',
      yccd: 'Mô tả cấu tạo ống tiêu hóa và các tuyến tiêu hóa; trình bày quá trình biến đổi cơ học và hóa học của thức ăn; thiết kế chế độ dinh dưỡng hợp lý, an toàn thực phẩm.',
      keyConcepts: ['Ống tiêu hóa', 'Dạ dày', 'Ruột non', 'Enzyme tiêu hóa', 'Gan và mật', 'Tháp dinh dưỡng', 'Vệ sinh an toàn thực phẩm']
    },
    {
      id: 'b8-33',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 33',
      title: 'Máu và hệ tuần hoàn của cơ thể người',
      yccd: 'Nêu thành phần của máu (huyết tương, hồng cầu, bạch cầu, tiểu cầu); mô tả cấu tạo tim và 2 vòng tuần hoàn máu; giải thích cơ chế đông máu, nhóm máu ABO, phòng bệnh tim mạch.',
      keyConcepts: ['Tim 4 ngăn', 'Hồng cầu', 'Bạch cầu miễn dịch', 'Tiểu cầu đông máu', 'Nhóm máu ABO', 'Vòng tuần hoàn lớn và nhỏ']
    },
    {
      id: 'b8-34',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 34',
      title: 'Hệ hô hấp ở người',
      yccd: 'Mô tả cấu tạo đường dẫn khí và phổi; trình bày cơ chế thông khí ở phổi (hít vào, thở ra) và trao đổi khí ở phế nang; nêu tác hại của khói thuốc lá, ô nhiễm không khí.',
      keyConcepts: ['Đường dẫn khí', 'Phế nang', 'Màng trao đổi khí', 'Hít vào thở ra', 'Khói thuốc lá', 'Phòng bệnh hô hấp']
    },
    {
      id: 'b8-35',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 35',
      title: 'Hệ bài tiết ở người',
      yccd: 'Mô tả cấu tạo thận và đơn vị chức năng của thận (nephron); trình bày quá trình tạo thành nước tiểu (lọc máu, hấp thụ lại, bài tiết tiếp); phòng bệnh sỏi thận, suy thận.',
      keyConcepts: ['Thận', 'Nephron', 'Nang cầu thận', 'Nước tiểu đầu', 'Nước tiểu chính thức', 'Sỏi thận', 'Thận nhân tạo']
    },
    {
      id: 'b8-36',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 36',
      title: 'Điều hoà môi trường trong của cơ thể người',
      yccd: 'Nêu khái niệm môi trường trong (máu, dịch mô, bạch huyết); giải thích cơ chế cân bằng nội môi về lượng đường huyết, áp suất thẩm thấu, nồng độ ion và pH máu.',
      keyConcepts: ['Môi trường trong', 'Cân bằng nội môi', 'Đường huyết', 'Insulin', 'Glucagon', 'Thận điều hòa áp suất thẩm thấu']
    },
    {
      id: 'b8-37',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 37',
      title: 'Hệ thần kinh và các giác quan ở người',
      yccd: 'Mô tả cấu tạo tế bào thần kinh (neuron), não bộ và tủy sống; phân biệt phản xạ không điều kiện và có điều kiện; mô tả cấu tạo mắt (tật khúc xạ) và tai.',
      keyConcepts: ['Neuron', 'Não bộ', 'Tủy sống', 'Cung phản xạ', 'Cận thị và loạn thị', 'Vệ sinh tai mắt']
    },
    {
      id: 'b8-38',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 38',
      title: 'Hệ nội tiết ở người',
      yccd: 'Nêu chức năng của các tuyến nội tiết chính: tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận, tuyến sinh dục; giải thích hậu quả rối loạn nội tiết (tiểu đường, bướu cổ).',
      keyConcepts: ['Hormone nội tiết', 'Tuyến yên', 'Tuyến giáp (Thyroxine)', 'Tuyến tụy (Insulin)', 'Bệnh bướu cổ Bazơđô', 'Bệnh tiểu đường']
    },
    {
      id: 'b8-39',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 39',
      title: 'Da và điều hoà thân nhiệt ở người',
      yccd: 'Mô tả cấu tạo các lớp của da (biểu bì, bì, mỡ dưới da); phân tích cơ chế điều hòa thân nhiệt khi trời nóng (toát mồ hôi, dãn mạch) và khi trời lạnh; cách chăm sóc da.',
      keyConcepts: ['Cấu tạo da', 'Tuyến mồ hôi', 'Mao mạch dưới da', 'Thân nhiệt 37 độ C', 'Chống say nắng', 'Vệ sinh da']
    },
    {
      id: 'b8-40',
      grade: 8,
      topic: 'Chương VII. Sinh học cơ thể người',
      code: 'Bài 40',
      title: 'Sinh sản ở người',
      yccd: 'Mô tả cơ quan sinh dục nam và nữ; thụ tinh, thụ thai và sự phát triển của thai nhi; hiểu biết về dậy thì, sức khỏe sinh sản vị thành niên, phòng bệnh lây truyền qua đường tình dục.',
      keyConcepts: ['Tuổi dậy thì', 'Kinh nguyệt', 'Tinh hoàn và buồng trứng', 'Thụ tinh trong', 'Biện pháp tránh thai', 'Sức khỏe sinh sản vị thành niên']
    },

    // Chương VIII. Sinh vật và môi trường
    {
      id: 'b8-41',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 41',
      title: 'Môi trường và các nhân tố sinh thái',
      yccd: 'Nêu định nghĩa môi trường sống và 4 môi trường chính; phân loại nhân tố vô sinh và hữu sinh; xác định giới hạn sinh thái của sinh vật đối với một nhân tố môi trường.',
      keyConcepts: ['Môi trường sống', 'Nhân tố vô sinh', 'Nhân tố hữu sinh', 'Giới hạn sinh thái', 'Điểm cực thuận']
    },
    {
      id: 'b8-42',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 42',
      title: 'Quần thể sinh vật',
      yccd: 'Trình bày khái niệm quần thể sinh vật; mô tả các đặc trưng cơ bản của quần thể (mật độ, tỉ lệ giới tính, nhóm tuổi, kiểu phân bố, kích thước quần thể).',
      keyConcepts: ['Quần thể sinh vật', 'Mật độ cá thể', 'Tỉ lệ đực cái', 'Tháp tuổi', 'Cạnh tranh cùng loài']
    },
    {
      id: 'b8-43',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 43',
      title: 'Quần xã sinh vật',
      yccd: 'Nêu khái niệm quần xã; các mối quan hệ giữa các loài trong quần xã (cộng sinh, hợp tác, hội sinh, cạnh tranh, ký sinh, sinh vật ăn sinh vật); hiện tượng khống chế sinh học.',
      keyConcepts: ['Quần xã sinh vật', 'Loài ưu thế', 'Cộng sinh', 'Ký sinh', 'Khống chế sinh học', 'Đấu tranh sinh học']
    },
    {
      id: 'b8-44',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 44',
      title: 'Hệ sinh thái',
      yccd: 'Mô tả cấu trúc một hệ sinh thái (sinh cảnh và quần xã); xây dựng chuỗi thức ăn, lưới thức ăn và tháp sinh thái; chu trình tuần hoàn vật chất và dòng năng lượng trong hệ sinh thái.',
      keyConcepts: ['Hệ sinh thái', 'Sinh vật sản xuất', 'Sinh vật tiêu thụ', 'Sinh vật phân giải', 'Chuỗi thức ăn', 'Lưới thức ăn', 'Tháp năng lượng']
    },
    {
      id: 'b8-45',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 45',
      title: 'Sinh quyển',
      yccd: 'Trình bày khái niệm sinh quyển và giới hạn của sinh quyển trên Trái Đất; nhận biết các khu sinh học trên cạn (rừng mưa nhiệt đới, hoang mạc, đài nguyên) và khu sinh học dưới nước.',
      keyConcepts: ['Sinh quyển', 'Khu sinh học (Biome)', 'Rừng nhiệt đới', 'Hệ sinh thái biển', 'Rạn san hô']
    },
    {
      id: 'b8-46',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 46',
      title: 'Cân bằng tự nhiên',
      yccd: 'Nêu trạng thái cân bằng tự nhiên của hệ sinh thái; nguyên nhân gây mất cân bằng tự nhiên do thiên tai và con người; các biện pháp duy trì cân bằng tự nhiên.',
      keyConcepts: ['Cân bằng sinh thái', 'Tự điều chỉnh', 'Biến đổi khí hậu', 'Ô nhiễm môi trường', 'Phục hồi hệ sinh thái']
    },
    {
      id: 'b8-47',
      grade: 8,
      topic: 'Chương VIII. Sinh vật và môi trường',
      code: 'Bài 47',
      title: 'Bảo vệ môi trường',
      yccd: 'Phân tích các tác động của ô nhiễm không khí, đất, nước và rác thải nhựa; đề xuất hành động cụ thể của bản thân và cộng đồng trong việc phân loại rác, trồng cây, sống xanh.',
      keyConcepts: ['Bảo vệ môi trường', 'Rác thải nhựa', 'Hiệu ứng nhà kính', 'Năng lượng tái tạo', 'Lối sống xanh']
    }
  ],

  // =========================================================================
  // KHOA HỌC TỰ NHIÊN 9
  // =========================================================================
  9: [
    // Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền
    {
      id: 'b9-36',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 36',
      title: 'Khái quát về di truyền học',
      yccd: 'Nêu khái niệm di truyền và biến dị; đối tượng nghiên cứu và ý nghĩa to lớn của di truyền học trong đời sống, y học và chọn giống nông nghiệp.',
      keyConcepts: ['Di truyền học', 'Hiện tượng di truyền', 'Hiện tượng biến dị', 'Tính trạng', 'Cặp tính trạng tương phản']
    },
    {
      id: 'b9-37',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 37',
      title: 'Các quy luật di truyền của Mendel',
      yccd: 'Trình bày phương pháp lai phân tích của Mendel; giải thích quy luật phân li (1 cặp tính trạng) và quy luật phân li độc lập (2 cặp tính trạng); viết sơ đồ lai.',
      keyConcepts: ['Gregor Mendel', 'Quy luật phân li', 'Quy luật phân li độc lập', 'Alen trội - lặn', 'Kiểu gene', 'Kiểu hình', 'Lai phân tích']
    },
    {
      id: 'b9-38',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 38',
      title: 'Nucleic acid và gene',
      yccd: 'Mô tả cấu trúc hóa học và không gian xoắn kép của phân tử DNA (A, T, G, C) theo nguyên tắc bổ sung; nêu khái niệm gene là một đoạn DNA mang thông tin mã hóa.',
      keyConcepts: ['DNA', 'Gene', 'Nucleotide (A, T, G, C)', 'Chuỗi xoắn kép Watson - Crick', 'Nguyên tắc bổ sung', 'Mã di truyền']
    },
    {
      id: 'b9-39',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 39',
      title: 'Tái bản DNA và phiên mã tạo RNA',
      yccd: 'Trình bày cơ chế nhân đôi DNA (bán bảo toàn, nguyên tắc bổ sung); mô tả cấu trúc các loại RNA (mRNA, tRNA, rRNA) và quá trình phiên mã tổng hợp RNA từ mạch khuôn DNA.',
      keyConcepts: ['Tái bản DNA', 'Nguyên tắc bán bảo toàn', 'Phiên mã (Transcription)', 'Phân tử mRNA', 'tRNA', 'Enzyme DNA polymerase']
    },
    {
      id: 'b9-40',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 40',
      title: 'Dịch mã và mối quan hệ từ gene đến tính trạng',
      yccd: 'Trình bày quá trình dịch mã tại ribosome tạo chuỗi polypeptide (protein); giải thích sơ đồ trung tâm sinh học phân tử: Gene (DNA) -> mRNA -> Protein -> Tính trạng.',
      keyConcepts: ['Dịch mã (Translation)', 'Ribosome', 'Codon và Anticodon', 'Axit amin', 'Chuỗi polypeptide', 'Sơ đồ trung tâm di truyền']
    },
    {
      id: 'b9-41',
      grade: 9,
      topic: 'Chương XI. Di truyền học Mendel - Cơ sở phân tử của hiện tượng di truyền',
      code: 'Bài 41',
      title: 'Đột biến gene',
      yccd: 'Nêu định nghĩa và các dạng đột biến gene (mất, thêm, thay thế một cặp nucleotide); nguyên nhân phát sinh; phân tích vai trò và hậu quả của đột biến gene.',
      keyConcepts: ['Đột biến gene', 'Đột biến điểm', 'Mất cặp nu', 'Thêm cặp nu', 'Thay thế cặp nu', 'Tác nhân gây đột biến']
    },

    // Chương XII. Di truyền nhiễm sắc thể
    {
      id: 'b9-42',
      grade: 9,
      topic: 'Chương XII. Di truyền nhiễm sắc thể',
      code: 'Bài 42',
      title: 'Nhiễm sắc thể và bộ nhiễm sắc thể',
      yccd: 'Mô tả hình thái, cấu trúc siêu hiển vi của nhiễm sắc thể (DNA + protein Histone); phân biệt bộ nhiễm sắc thể lưỡng bội (2n) và đơn bội (n); tính đặc trưng của bộ NST từng loài.',
      keyConcepts: ['Nhiễm sắc thể (NST)', 'Protein Histone', 'Cromatin', 'Bộ NST 2n và n', 'Cặp NST tương đồng', 'Bộ NST người (2n = 46)']
    },
    {
      id: 'b9-43',
      grade: 9,
      topic: 'Chương XII. Di truyền nhiễm sắc thể',
      code: 'Bài 43',
      title: 'Nguyên phân và giảm phân',
      yccd: 'Mô tả diễn biến của NST qua các kì trong nguyên phân (tạo 2 tế bào con 2n giống hệt tế bào mẹ) và giảm phân (tạo 4 giao tử n); nêu ý nghĩa sinh học của nguyên phân, giảm phân, thụ tinh.',
      keyConcepts: ['Nguyên phân (Mitosis)', 'Giảm phân (Meiosis)', 'Kì đầu, giữa, sau, cuối', 'Thoi phân bào', 'Tạo giao tử', 'Duy trì bộ NST loài']
    },
    {
      id: 'b9-44',
      grade: 9,
      topic: 'Chương XII. Di truyền nhiễm sắc thể',
      code: 'Bài 44',
      title: 'Nhiễm sắc thể giới tính và cơ chế xác định giới tính',
      yccd: 'Phân biệt NST thường và NST giới tính (XX, XY); giải thích cơ chế xác định giới tính ở người (tỉ lệ xấp xỉ 1 nam : 1 nữ khi thụ tinh); các yếu tố ảnh hưởng đến sự phân hóa giới tính.',
      keyConcepts: ['NST giới tính', 'Cặp NST XX và XY', 'Xác định giới tính', 'Tỉ lệ đực cái 1:1', 'Di truyền liên kết giới tính']
    },
    {
      id: 'b9-45',
      grade: 9,
      topic: 'Chương XII. Di truyền nhiễm sắc thể',
      code: 'Bài 45',
      title: 'Di truyền liên kết',
      yccd: 'Trình bày thí nghiệm lai ruồi giấm của Thomas Morgan; giải thích hiện tượng các gene trên cùng 1 NST cùng phân li về giao tử (di truyền liên kết hoàn toàn); ý nghĩa trong chọn giống.',
      keyConcepts: ['Thomas Hunt Morgan', 'Ruồi giấm (Drosophila)', 'Di truyền liên kết', 'Nhóm gene liên kết']
    },
    {
      id: 'b9-46',
      grade: 9,
      topic: 'Chương XII. Di truyền nhiễm sắc thể',
      code: 'Bài 46',
      title: 'Đột biến nhiễm sắc thể',
      yccd: 'Phân biệt đột biến cấu trúc NST (mất đoạn, lặp đoạn, đảo đoạn, chuyển đoạn) và đột biến số lượng NST (thể lệch bội như hội chứng Down 3 NST 21, thể đa bội 3n, 4n).',
      keyConcepts: ['Đột biến cấu trúc NST', 'Đột biến số lượng NST', 'Thể lệch bội', 'Hội chứng Down', 'Thể đa bội']
    },

    // Chương XIII. Di truyền học với con người và đời sống
    {
      id: 'b9-47',
      grade: 9,
      topic: 'Chương XIII. Di truyền học với con người và đời sống',
      code: 'Bài 47',
      title: 'Di truyền học với con người',
      yccd: 'Trình bày phương pháp nghiên cứu phả hệ; nêu các bệnh và tật di truyền ở người (Down, Turner, bạch tạng, máu khó đông); tư vấn di truyền hôn nhân và sàng lọc trước sinh.',
      keyConcepts: ['Di truyền y học', 'Nghiên cứu phả hệ', 'Hội chứng Turner', 'Bệnh máu khó đông', 'Tư vấn di truyền', 'Hôn nhân cận huyết']
    },
    {
      id: 'b9-48',
      grade: 9,
      topic: 'Chương XIII. Di truyền học với con người và đời sống',
      code: 'Bài 48',
      title: 'Ứng dụng công nghệ di truyền vào đời sống',
      yccd: 'Nêu khái niệm công nghệ gene và công nghệ tế bào; nêu thành tựu tạo giống cây trồng chuyển gene chống sâu bệnh, vi khuẩn mang gene sản xuất insulin người, nhân bản vô tính.',
      keyConcepts: ['Công nghệ gene', 'Sinh vật biến đổi gene (GMO)', 'Insulin tái tổ hợp', 'Công nghệ tế bào', 'Nhân bản vô tính']
    },

    // Chương XIV. Tiến hoá
    {
      id: 'b9-49',
      grade: 9,
      topic: 'Chương XIV. Tiến hoá',
      code: 'Bài 49',
      title: 'Khái niệm tiến hoá và các hình thức chọn lọc',
      yccd: 'Nêu khái niệm tiến hoá sinh học; phân biệt chọn lọc nhân tạo (do con người tiến hành) và chọn lọc tự nhiên (Charles Darwin) trong việc hình thành đặc điểm thích nghi của sinh vật.',
      keyConcepts: ['Tiến hoá', 'Chọn lọc tự nhiên', 'Chọn lọc nhân tạo', 'Charles Darwin', 'Đặc điểm thích nghi']
    },
    {
      id: 'b9-50',
      grade: 9,
      topic: 'Chương XIV. Tiến hoá',
      code: 'Bài 50',
      title: 'Cơ chế tiến hoá',
      yccd: 'Trình bày vai trò của đột biến và giao phối tạo nguồn biến dị; tác động của chọn lọc tự nhiên giữ lại các cá thể thích nghi và sự cách li địa lý/sinh sản dẫn đến hình thành loài mới.',
      keyConcepts: ['Cơ chế tiến hoá', 'Đột biến và biến dị tổ hợp', 'Sự phân hóa khả năng sống sót', 'Hình thành loài mới', 'Cách li sinh sản']
    },
    {
      id: 'b9-51',
      grade: 9,
      topic: 'Chương XIV. Tiến hoá',
      code: 'Bài 51',
      title: 'Sự phát sinh và phát triển sự sống trên Trái Đất',
      yccd: 'Mô tả tóm tắt các giai đoạn phát sinh sự sống (tiến hóa hóa học, tiến hóa tiền sinh học, tiến hóa sinh học); các đại địa chất (Thái cổ, Nguyên sinh, Cổ sinh, Trung sinh, Tân sinh) và nguồn gốc loài người.',
      keyConcepts: ['Phát sinh sự sống', 'Thí nghiệm Miller - Urey', 'Hóa thạch', 'Các đại địa chất', 'Nguồn gốc loài người (Vượn người Homo)']
    }
  ]
};

// Hàm trợ giúp lấy danh sách bài học theo khối lớp
export function getLessonsByGrade(grade: GradeNumber): Lesson[] {
  return MASTER_SYLLABUS[grade] || [];
}

// Hàm tìm bài học theo ID
export function findLessonById(lessonId: string): Lesson | undefined {
  for (const grade of [6, 7, 8, 9] as GradeNumber[]) {
    const found = MASTER_SYLLABUS[grade].find(l => l.id === lessonId);
    if (found) return found;
  }
  return undefined;
}
