class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public purchasedCourses: string[],
    public discounts: string[]
  ) {}
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
  buyCourse(course: string) {
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

abstract class Course {
  constructor(
    public courseId: string,
    public courseName: string,
    public price: number,
    public duration: number,
    public students: number
  ) {}
  displayCourse() {
    console.log(`
            Id:${this.courseId},
            courseName:${this.courseName},
            price:${this.price},
            duration:${this.duration},
            students:${this.students}
        `);
  }
  getCourse(discount?: number): string {
    this.students++;
    return `mua khóa học thành công`;
  }
  getCertificate() {}
  getRefundPolicy() {}
}
class FreeCourse extends Course {
  constructor(
    courseId: string,
    courseName: string,
    price: number,
    duration: number,
    students: number
  ) {
    super(courseId, courseName, price, duration, students);
  }
  getCertificate(): void {
    console.log("không có chứng chỉ");
  }
  getRefundPolicy(): void {
    console.log("Không có chính sách hoàn tiền");
  }
}
class PaidCourse extends Course {
  constructor(
    courseId: string,
    courseName: string,
    price: number,
    duration: number,
    students: number
  ) {
    super(courseId, courseName, price, duration, students);
  }
  getCertificate(): void {
    console.log("có cấp chứng chỉ");
  }
  getRefundPolicy(): void {
    console.log("Hoàn lại tiền nếu nhưng thời gian học dưới 2 giờ");
  }
  public getStudents() {
    return this.students;
  }
}
interface Discount {
  code: string;
  Value: number;
}
class CourseManager {
  public static newId = 0;
  constructor(
    public courses: Course[],
    public users: User[],
    public discounts: Discount[]
  ) {}
  createUser(name: string, email: string, phone: string): void {
    CourseManager.newId++;
    const id = String(CourseManager.newId);
    this.users.push(new User(id, name, email, phone, [], []));
    console.log("đăng kí người dùng thành công");
  }
  addCourse(
    type: "free" | "paid",
    courseName: string,
    coursePrice: number,
    courseDuration: number
  ): void {
    CourseManager.newId++;
    const id = String(CourseManager.newId);
    let course: Course;
    if (type === "free") {
      course = new FreeCourse(id, courseName, coursePrice, courseDuration, 0);
    } else {
      course = new PaidCourse(id, courseName, coursePrice, courseDuration, 0);
    }
    this.courses.push(course);
    console.log("thêm khóa học thành công");
  }
  createNewDiscount(discountCode: string, discountValue: number): void {
    const discount: Discount = { code: discountCode, Value: discountValue };
    this.discounts.push(discount);
    console.log("thêm mã giảm giá thành công");
  }
  handleBuyCourse(userId: string, courseId: string): string {
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

  listCourses(numOfStudents?: number): void {
    this.courses.map((item) =>
      console.log(`
                ${item.displayCourse}
                Certificate:${item.getCertificate},
                RefundPolicy:${item.getRefundPolicy}
                `)
    );
  }

  showUserInformation(email: string): void {
    const userFind = this.users.find((item) => item.email == email);
    if (!userFind) {
      console.log("không tìm thấy email");
    } else {
      userFind.getDetails();
    }
  }
  calculateTotalRevenue(): number {
    return this.courses.reduce((total, course) => {
      if (course instanceof PaidCourse) {
        return total + course.students * course.price;
      }
      return total;
    }, 0);
  }
  giftDiscount(userId: string, discountCode: string): void {
    const userFind = this.users.find((item) => item.id == userId);
    if (!userFind) {
      console.log("không tìm thấy người dùng");
      return;
    }
    const discount = this.discounts.find((d) => d.code == discountCode);
    if (!discount) {
      console.log("không tìm thấy mã giảm giá");
      return;
    }
    userFind.discounts.push(discountCode);
    console.log(`Đã tặng mã giảm giá "${discountCode}" cho ${userFind.name}`);
  }
  getRefundPolicy(courseId: string): void {
    const courseFind = this.courses.find((item) => item.courseId === courseId);
    if (!courseFind) {
      console.log("không tìm thấy khóa học");
      return;
    }
    courseFind.getRefundPolicy();
  }
}

let choice: number;
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
      break;
    case 6:
      courseManagers.listCourses();
      break;
    case 7:
      courseManagers.showUserInformation("duy@gmail.com");
      break;
    case 8:
      console.log(
        "Tổng doanh thu: " + courseManagers.calculateTotalRevenue() + " VND"
      );
      break;
    case 9:
      courseManagers.giftDiscount("1", "duydeptrai");
      break;
    case 10:
      break;
      case 11:
            courseManagers.getRefundPolicy("1");
      break;
    case 12:
      console.log("cảm ơn bạn đã sử dungh trương trình");
      break;
    default:
      console.log("lựa chọn không hợp lệ");
      break;
  }
} while (choice !== 12);
