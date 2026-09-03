import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [editingId, setEditingId] = useState(null);

    // =====================================
    // GET students
    // =====================================
    const loadStudents = async () => {
        try {
            const response = await fetch("/api/students");

            const data = await response.json();

            setStudents(data);
        } catch (error) {
            console.error("Error loading students:", error);
        }
    };

    // =====================================
    // Load khi mở trang
    // =====================================
    useEffect(() => {
        loadStudents();
    }, []);

    // =====================================
    // POST / PUT
    // =====================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !name || !email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            let response;

            if (editingId) {
                // PUT
                response = await fetch(
                    `/api/students/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            studentId,
                            name,
                            email
                        })
                    }
                );
            } else {
                // POST
                response = await fetch("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId,
                        name,
                        email
                    })
                });
            }

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Có lỗi xảy ra!");
                return;
            }

            alert(
                editingId
                    ? "Cập nhật sinh viên thành công!"
                    : "Thêm sinh viên thành công!"
            );

            // Xóa form
            setStudentId("");
            setName("");
            setEmail("");
            setEditingId(null);

            // Load lại danh sách
            loadStudents();

        } catch (error) {
            console.error(error);
            alert("Không thể kết nối Backend!");
        }
    };

    // =====================================
    // DELETE
    // =====================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa sinh viên này?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Xóa thất bại!");
                return;
            }

            alert("Xóa sinh viên thành công!");

            loadStudents();

        } catch (error) {
            console.error(error);
            alert("Không thể kết nối Backend!");
        }
    };

    // =====================================
    // Edit
    // =====================================
    const handleEdit = (student) => {
        setEditingId(student._id);

        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);
    };

    // =====================================
    // Cancel Edit
    // =====================================
    const handleCancel = () => {
        setEditingId(null);

        setStudentId("");
        setName("");
        setEmail("");
    };

    return (
        <div className="container">

            <h1>Quản Lý Sinh Viên</h1>

            {/* FORM */}
            <div className="form-container">

                <h2>
                    {editingId
                        ? "Cập nhật sinh viên"
                        : "Thêm sinh viên"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="MSSV"
                        value={studentId}
                        onChange={(e) =>
                            setStudentId(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Họ tên"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <button type="submit">
                        {editingId ? "Cập nhật" : "Thêm sinh viên"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                        >
                            Hủy
                        </button>
                    )}

                </form>
            </div>

            {/* DANH SÁCH */}
            <div className="table-container">

                <h2>Danh sách sinh viên</h2>

                <table>

                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>

                        {students.length === 0 ? (

                            <tr>
                                <td colSpan="5">
                                    Chưa có sinh viên
                                </td>
                            </tr>

                        ) : (

                            students.map((student, index) => (

                                <tr key={student._id}>

                                    <td>{index + 1}</td>

                                    <td>
                                        {student.studentId}
                                    </td>

                                    <td>
                                        {student.name}
                                    </td>

                                    <td>
                                        {student.email}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(student)
                                            }
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(student._id)
                                            }
                                        >
                                            Xóa
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default App;