//FAKE Json

const employees = [
    {
        id: 1,
        maNhanVien: "NV"+ String(100+1),
        ho: 'Nguyen',
        ten: 'Anh',
        gioitinh: 'Nam',
        ngaysinh: '1990-05-15',
        sdt: '0987654321',
        stk: '1234567890',
        email: 'nguyen.anh@example.com',
        diachi: 'Hà Nội, Việt Nam',
        ngaydilam: '2020-01-01',
        chucVu: 'Quản lý',
        luong: 15000000,
        cuahang: 'Cửa hàng A',
        chinhanh: 'Chi nhánh 1'
    },
    {
        id: 2,
        maNhanVien: "NV"+ String(100+2),
        ho: 'Tran',
        ten: 'Bích',
        gioitinh: 'Nữ',
        ngaysinh: '1985-09-22',
        sdt: '0123456789',
        stk: '0987654321',
        email: 'tran.bich@example.com',
        diachi: 'TP. Hồ Chí Minh, Việt Nam',
        ngaydilam: '2019-07-12',
        chucVu: 'Nhân viên bán hàng',
        luong: 10000000,
        cuahang: 'Cửa hàng B',
        chinhanh: 'Chi nhánh 2'
    },
    {
        id: 3,
        maNhanVien: "NV"+ String(100+3),
        ho: 'Le',
        ten: 'Duy',
        gioitinh: 'Nam',
        ngaysinh: '1992-11-10',
        sdt: '0234567890',
        stk: '1122334455',
        email: 'le.duy@example.com',
        diachi: 'Đà Nẵng, Việt Nam',
        ngaydilam: '2021-03-01',
        chucVu: 'Kế toán',
        luong: 13000000,
        cuahang: 'Cửa hàng C',
        chinhanh: 'Chi nhánh 3'
    },
    {
        id: 4,
        maNhanVien: "NV"+ String(100+4),
        ho: 'Pham',
        ten: 'Mai',
        gioitinh: 'Nữ',
        ngaysinh: '1995-02-25',
        sdt: '0345678901',
        stk: '2233445566',
        email: 'pham.mai@example.com',
        diachi: 'Hải Phòng, Việt Nam',
        ngaydilam: '2022-06-10',
        chucVu: 'Trợ lý giám đốc',
        luong: 20000000,
        cuahang: 'Cửa hàng D',
        chinhanh: 'Chi nhánh 4'
    },
    {
        id: 5,
        maNhanVien: "NV"+ String(100+5),
        ho: 'Hoang',
        ten: 'Hoa',
        gioitinh: 'Nữ',
        ngaysinh: '1993-07-30',
        sdt: '0456789012',
        stk: '3344556677',
        email: 'hoang.hoa@example.com',
        diachi: 'Cần Thơ, Việt Nam',
        ngaydilam: '2020-12-05',
        chucVu: 'Nhân viên marketing',
        luong: 12000000,
        cuahang: 'Cửa hàng E',
        chinhanh: 'Chi nhánh 5'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const employeeList = document.getElementById('employee-list');
    const employeeModal = document.getElementById('employee-modal');
    const employeeDetails = document.getElementById('employee-details');
    const closeModal = document.getElementById('close-details-modal');
    const addEmployeeButton = document.getElementById('add-employee');
    const updateEmployeeButton = document.getElementById('update-employee');
    const deleteEmployeeButton = document.getElementById('delete-employee');

    const addEmployeeModal = document.getElementById('add-employee-modal');
    const closeAddModal = document.getElementById('close-add-modal');
    const addEmployeeForm = document.getElementById('add-employee-form');

    const editEmployeeModal = document.getElementById('edit-employee-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const editEmployeeForm = document.getElementById('edit-employee-form');

    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    const itemsPerPage = 10; // Số lượng nhân viên hiển thị trên mỗi trang
    let currentPage = 1;

// RENDER ra màn hình
    function renderEmployeeList(page,employeesList) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        employeeList.innerHTML = '';
        const currentEmployees = employeesList.slice(startIndex, endIndex);
        currentEmployees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.maNhanVien}</td>
                <td>${employee.ho}</td>
                <td>${employee.ten}</td>
                <td>${employee.gioitinh}</td>
                <td>${employee.chucVu}</td>
                <td>${employee.luong}</td>
                <td>${employee.ngaydilam}</td>
                <td>${employee.cuahang}</td>
                <td>${employee.chinhanh}</td>
                <td><button class="view-details" data-id="${employee.id}">Chi Tiết</button></td>
                `;
            employeeList.appendChild(row);

        });

        // Cập nhật thông tin trang
        const pageInfo = document.getElementById('page-info');
        pageInfo.textContent = `${page} / ${Math.ceil(employeesList.length / itemsPerPage)}`;

        // Cập nhật trạng thái nút phân trang
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page === Math.ceil(employeesList.length / itemsPerPage);
    }
    // Sự kiện cho nút phân trang
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEmployeeList(currentPage,employees);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
            currentPage++;
            renderEmployeeList(currentPage,employees);
        }
    });

    // Tìm kiếm và sắp xếp
    function filterAndSortObject(){
        let filterObject = employees;
        const searchValue = String(searchInput.value).toLowerCase().trim(); 

        if(searchValue){
            filterObject = filterObject.filter(employee => {
                // Tìm theo tên
                if((employee.ho + employee.ten).toLowerCase().includes(searchValue)){
                    return true;
                }
                // tìm theo giới tính
                else if (searchValue == 'nam' || searchValue == 'nữ'){
                    return employee.gioitinh.toLowerCase() == searchValue
                }
                else{
                    for(let key in employee){
                        if(employee[key].toString().toLowerCase().includes(searchValue)){
                            return true
                        }
                    }
                    return false;
                }
            })
        }

        // sắp xếp
        const sortValue = sortSelect.value;
        if (sortValue) {
            const [key, order] = sortValue.split('-'); // tách thành tên và thứ tự
            filterObject.sort((a, b) => {
                // sắp xếp theo tên
                if (key == 'ten') {
                    const nameA = `${a.ten}`;
                    const nameB = `${b.ten}`;
                    if(order =='tang'){
                        return nameA.localeCompare(nameB) // trả về <0 nếu a < b
                    }else{
                        return nameB.localeCompare(nameA) 
                    }
                }
                // sắp xếp theo lương
                else if (key == 'luong') {
                    return order == 'tang' ? a.luong - b.luong : b.luong - a.luong;
                } else if (key == 'ngaydilam') {
                    console.log(new Date(a.ngaydilam))
                    return order == 'tang' ? new Date(a.ngaydilam) - new Date(b.ngaydilam) : new Date(b.ngaydilam) - new Date(a.ngaydilam);
                }
                return 0;
            });
        }
        
        renderEmployeeList(currentPage,filterObject)
    }
    searchInput.addEventListener('input', filterAndSortObject);
    sortSelect.addEventListener('change', filterAndSortObject);

    // Xem thông tin chi tiết của object
    function showEmployeeDetails(id) {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            employeeDetails.innerHTML = `
                <table>
                    <tr>
                        <td>Mã Nhân Viên</td>
                        <td>${employee.maNhanVien}</td>
                    </tr>
                    <tr>
                        <td>Họ</td>
                        <td>${employee.ho}</td>
                    </tr>
                    <tr>
                        <td>Tên</td>
                        <td>${employee.ten}</td>
                    </tr>
                    <tr>
                        <td>Ngày sinh</td>
                        <td>${employee.ngaysinh}</td>
                    </tr>
                    <tr>
                        <td>Giới tính</td>
                        <td>${employee.gioitinh}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${employee.email}</td>
                    </tr>
                    <tr>
                        <td>SĐT</td>
                        <td>${employee.sdt}</td>
                    </tr>
                    <tr>
                        <td>Số Tài Khoản</td>
                        <td>${employee.stk}</td>
                    </tr>
                    <tr>
                        <td>Địa chỉ</td>
                        <td>${employee.diachi}</td>
                    </tr>
                    <tr>
                        <td>Chức vụ</td>
                        <td>${employee.chucVu}</td>
                    </tr>
                    <tr>
                        <td>Lương</td>
                        <td>${employee.luong}</td>
                    </tr>
                    <tr>
                        <td>Ngày đi làm</td>
                        <td>${employee.ngaydilam}</td>
                    </tr>
                    <tr>
                        <td>Cửa hàng làm việc</td>
                        <td>${employee.cuahang}</td>
                    </tr>
                    <tr>
                        <td>Chi nhánh làm việc</td>
                        <td>${employee.chinhanh}</td>
                    </tr>
                </table>

            `;
            document.getElementById('update-employee').setAttribute('data-id',id)
            document.getElementById('delete-employee').setAttribute('data-id',id)

            employeeModal.style.display = 'block';
        }
    }

    closeModal.onclick = function() {
        employeeModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === employeeModal) {
            employeeModal.style.display = 'none';
        }
    }

    employeeList.addEventListener('click', function(event) {
        if (event.target.classList.contains('view-details')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            showEmployeeDetails(id);
        }
    });

    
    // XÓA NHÂN VIÊN
    deleteEmployeeButton.onclick = function() {
        const ID = deleteEmployeeButton.getAttribute('data-id')
        const employeeIndex = employees.findIndex(emp => emp.id == ID);
        alert(employeeIndex)
        if (employeeIndex !== -1) // tìm được index
        {
            // Xóa nhân viên khỏi danh sách
            // Cập nhập trên database TODO

            // test fake DATA
            employees.splice(employeeIndex, 1);
            alert('Xóa nhân viên thành công!');
            employeeModal.style.display = 'none'; // Đóng modal chi tiết
            renderEmployeeList(currentPage,employees); // Cập nhật lại danh sách nhân viên

        }
        else{
            alert("Nhân viên không tồn tại")
        }
    };

    
    // Thêm nhân viên
    addEmployeeButton.onclick = function() {
        addEmployeeModal.style.display = 'block';
    };
    
    closeAddModal.onclick = function() {
        addEmployeeModal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === addEmployeeModal) {
            addEmployeeModal.style.display = 'none';
        }
    };
    addEmployeeForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const newEmployee = {
            id: employees.length + 1, // Tạo ID mới
            maNhanVien: "NV"+(100 + employees.length+1),
            ho: document.getElementById('ho').value,
            ten: document.getElementById('ten').value,
            ngaysinh: document.getElementById('Ngaysinh').value,
            gioitinh: document.getElementById('gioitinh').value,
            email:document.getElementById('email').value,
            sdt:document.getElementById('SĐT').value,
            stk:document.getElementById('STK').value,
            diachi:document.getElementById('diachi').value,
            ngaydilam:document.getElementById('Ngaydilam').value,
            chucVu: document.getElementById('chucVu').value,
            luong: parseFloat(document.getElementById('luong').value),
            cuahang: document.getElementById('cuahang').value,
            chinhanh: document.getElementById('chinhanh').value
        };
        try {
            //Thêm vào db
            // TODO
            employees.push(newEmployee)
            console.log(employees)
            alert("Thêm thành công")
            addEmployeeModal.style.display = 'none'
            renderEmployeeList(currentPage,employees)
        } catch (error) {
            alert("Thêm thất bại")
        }
        // Gửi dữ liệu đến server
    });
    
    // EDIT NHÂN VIÊN

    updateEmployeeButton.onclick = function() {
        employeeModal.style.display = 'none';
        editEmployeeModal.style.display = 'block';
        const ID = updateEmployeeButton.getAttribute('data-id');
        let employee;
        for (let emp of employees){
            console.log(emp)
            if(emp.id == ID){
                employee = emp;
                break;
            }
        }
        if(employee){
            editEmployeeForm.innerHTML = `
            <input type="hidden" id="edit-id" value = ${employee.id}>
            <label for="edit-ho">Họ:</label>
            <input type="text" id="edit-ho" value = "${employee.ho}" required>
            <label for="edit-ten">Tên:</label>
            <input type="text" id="edit-ten" value = "${employee.ten}"required>
            <label for="edit-gioitinh">Giới Tính:</label>
            <input type="text" id="edit-ten" value = "${employee.gioitinh}"required>
            <label for="edit-Ngaysinh">Ngày sinh:</label>
            <input type="date" id="edit-Ngaysinh" value = "${employee.ngaysinh}" required>
            <label for="edit-gioitinh">Giới Tính:</label>
            <select id="edit-gioitinh">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
            <label for="edit-SĐT">SĐT:</label>
            <input type="number" id="edit-SĐT" value = "${employee.sdt}" required>
            <label for="edit-STK">STK:</label>
            <input type="number" id="edit-STK" value = "${employee.stk}" required>
            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" value = "${employee.email}" required>
            <label for="edit-diachi">Địa chỉ:</label>
            <input type="text" id="edit-diachi" value = "${employee.diachi}" required>
            <label for="edit-Ngaydilam">Ngày đi làm:</label>
            <input type="date" id="edit-Ngaydilam" value = "${employee.ngaydilam}" required>

            <label for="edit-chucVu">Chức Vụ:</label>
            <input type="text" id="edit-chucVu" value = "${employee.chucVu}" required>
            <label for="edit-luong">Lương:</label>
            <input type="number" id="edit-luong" value = "${employee.luong}" required>
            <label for="edit-cuahang">Cửa hàng làm việc:</label>
            <input type="text" id="edit-cuahang" value = "${employee.cuahang}" required>
            <label for="chinhanh">Chi Nhánh:</label>
            <input type="text" id="edit-chinhanh" value = "${employee.chinhanh}" required>
            <button type="submit">Cập Nhật Nhân Viên</button>
            `;
        }
        else{
            alert("khong tìm được")
        }
    };
    editEmployeeForm.addEventListener("submit", async function(event){
        event.preventDefault();
        ID = document.getElementById('edit-id').value;
        const empIndex = employees.findIndex(emp => emp.id == ID)

        employees[empIndex].ho = document.getElementById('edit-ho').value;
        employees[empIndex].ten = document.getElementById('edit-ten').value;
        employees[empIndex].namsinh = document.getElementById('edit-Ngaysinh').value;
        employees[empIndex].gioitinh = document.getElementById('edit-gioitinh').value;
        employees[empIndex].email =document.getElementById('edit-email').value;
        employees[empIndex].sdt =document.getElementById('edit-SĐT').value;
        employees[empIndex].stk =document.getElementById('edit-STK').value;
        employees[empIndex].diachi =document.getElementById('edit-diachi').value;
        employees[empIndex].ngaydilam =document.getElementById('edit-Ngaydilam').value;
        employees[empIndex].chucVu = document.getElementById('edit-chucVu').value;
        employees[empIndex].luong = parseFloat(document.getElementById('edit-luong').value);
        employees[empIndex].cuahang = document.getElementById('edit-cuahang').value;
        employees[empIndex].chinhanh = document.getElementById('edit-chinhanh').value;

        editEmployeeModal.style.display = 'none';
        alert("cập nhập thành công")
        renderEmployeeList(currentPage,employees)
        // Gửi tới server
    })
    closeEditModal.onclick = function() {
        editEmployeeModal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target === editEmployeeModal) {
            editEmployeeModal.style.display = 'none';
        }
    }
    
    console.log(employees)
    renderEmployeeList(currentPage,employees);
});