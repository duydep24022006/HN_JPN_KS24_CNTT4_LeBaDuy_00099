"use strict";
class User {
  constructor(id, name, email, phone, purchasedCourses, discounts) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.purchasedCourses = purchasedCourses;
    this.discounts = discounts;
  }
  getDetails() {
    return `
        Id:${this.id},
        Name:${this.name},
        Email:${this.email},
        phone:${this.phone},
        purchasedCourses:${this.purchasedCourses.forEach((item, index) => {
          `khóa học ${index + 1}:${item},`;
        })},
        discounts:${this.discounts.forEach((item, index) => {
          `mã giảm giá ${index + 1}:${item},`;
        })}`;
  }
  buyCourse(course) {
    const courseFind = this.purchasedCourses.find(
      (item) => item.toLocaleLowerCase() == course.toLocaleLowerCase()
    );
    if (!courseFind) {
      console.log("không tìm thấy khóa học");
    } else {
      this.purchasedCourses.push(courseFind);
    }
  }
}
class Course {
  constructor(courseId, courseName, price, duration, students) {
    this.courseId = courseId;
    this.courseName = courseName;
    this.price = price;
    this.duration = duration;
    this.students = students;
  }
  displayCourse() {
    console.log(`
            Id:${this.courseId},
            courseName:${this.courseName},
            price:${this.price},
            duration:${this.duration},
            students:${this.students}
        `);
  }
  getCourse(discount) {
    this.students++;
    return `mua khóa học thành công`;
  }
  getCertificate() {}
  getRefundPolicy() {}
}
class FreeCourse extends Course {
  constructor(courseId, courseName, price, duration, students) {
    super(courseId, courseName, price, duration, students);
  }
  getCertificate() {
    console.log("không có chứng chỉ");
  }
  getRefundPolicy() {
    console.log("Không có chính sách hoàn tiền");
  }
}
class PaidCourse extends Course {
  constructor(courseId, courseName, price, duration, students) {
    super(courseId, courseName, price, duration, students);
  }
  getCertificate() {
    console.log("có cấp chứng chỉ");
  }
  getRefundPolicy() {
    console.log("Hoàn lại tiền nếu nhưng thời gian học dưới 2 giờ");
  }
  getStudents() {
    return this.students;
  }
}
class CourseManager {
  constructor(courses, users, discounts) {
    this.courses = courses;
    this.users = users;
    this.discounts = discounts;
  }
  createUser(name, email, phone) {
    CourseManager.newId++;
    const id = String(CourseManager.newId);
    this.users.push(new User(id, name, email, phone, [], []));
    console.log("đăng kí người dùng thành công");
  }
  addCourse(type, courseName, coursePrice, courseDuration) {
    CourseManager.newId++;
    const id = String(CourseManager.newId);
    let course;
    if (type === "free") {
      course = new FreeCourse(id, courseName, coursePrice, courseDuration, 0);
    } else {
      course = new PaidCourse(id, courseName, coursePrice, courseDuration, 0);
    }
    console.log("thêm khóa học thành công");
  }
  createNewDiscount(discountCode, discountValue) {
    const discount = { code: discountCode, Value: discountValue };
    this.discounts.push(discount);
    console.log("thêm mã giảm giá thành công");
  }
  handleBuyCourse(userId, courseId) {
    const userFind = this.users.find((item) => item.id == userId);
    if (!userFind) {
      return "không tìm thấy người dùng";
    }
    const courseFind = this.courses.find((item) => item.courseId == courseId);
    if (!courseFind) {
      return "không tìm thấy khóa học";
    }
    userFind.buyCourse(courseFind.courseName);
    return courseFind.getCourse();
  }
  listCourses(numOfStudents) {
    this.courses.map((item) =>
      console.log(`
                ${item.displayCourse}
                Certificate:${item.getCertificate},
                RefundPolicy:${item.getRefundPolicy}
                `)
    );
  }
  showUserInformation(email) {
    const userFind = this.users.find((item) => item.email == email);
    if (!emaiFind) {
      console.log("không tìm thấy email");
    } else {
      userFind.getDetails();
    }
  }
}

CourseManager.newId = 0;
let choice;
const courseManagers = new CourseManager([], [], []);
do {
  console.log("-------------menu---------------");
  console.log("Thêm người dùng.");
  console.log("Thêm khóa học.");
  console.log("Thêm mã giảm giá.");
  console.log("Mua khóa học.");
  console.log("Hoàn tiền khóa học.");
  console.log("Hiển thị danh sách khóa học.");
  console.log("Hiển thị thông tin người dùng.");
  console.log("Tính tổng doanh thu từ các khóa học đã bán.");
  console.log("Tặng mã giảm giá cho người dùng.");
  console.log("Hiển thị toàn bộ chứng chỉ của người dùng.");
  console.log("Hiển thị chính sách hoàn tiền.");
  console.log("Thoát chương trình. ");
  console.log("Lưa chọn của ban: ");
  choice = Number(prompt("mời ban nhập sự lưa chọn"));
  switch (choice) {
    case 1:
      courseManagers.createUser("duy", "duy@gmail.com", "0987654321");
      break;
    case 2:
      courseManagers.addCourse("paid", "java", 1000000, 123456);
      courseManagers.addCourse("free", "java", 0, 123456);
      break;
    case 3:
      courseManagers.createNewDiscount("duydeptrai", 100000);
      break;
    case 4:
      courseManagers.handleBuyCourse("1", "1");
      break;
    case 5:
      listCourses(numOfStudents);
      break;
      case 6:
          
      showUserInformation("duy@gmail.com");
      break;
    case 7:
      break;
    case 8:
      break;
    case 9:
      break;
    case 10:
      break;
    case 11:
      break;
    case 12:
      console.log("cảm ơn bạn đã sử dungh trương trình");
      break;
    default:
      console.log("lựa chọn không hợp lệ");
      break;
  }
} while (choice !== 12);
