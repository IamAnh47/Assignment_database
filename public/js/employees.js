const employees = [];
const ChiNhanhData = [];
const CuaHangData = [];
const KhoHangData = [];
// Hàm để lấy dữ liệu từ API và gán vào mảng
function fetchDataAndAssignToArray(apiUrl, targetArray) {
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            targetArray.push(...data);
            console.log('Dữ liệu đã gán:', targetArray);
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}

//Dùng để list nhân viên
const employeeList = document.getElementById('employee-list');
// Hàm hiển thị danh sách nhân viên lên bảng
async function renderEmployeeList(employeesList) {
    employeeList.innerHTML = ''; 
    employeesList.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.MaNV}</td>
            <td>${employee.Ho}</td>
            <td>${employee.Ten}</td>
            <td>${employee.GioiTinh}</td>
            <td>${employee.ChucVu}</td>
            <td>${employee.Luong}</td>
            <td>${employee.IDCuaHang}</td>
            <td>${employee.IDKho}</td>
            <td>${employee.IDChiNhanh}</td>
            <td><button class="view-details" data-id="${employee.MaNV}">Chi Tiết</button></td>
        `;
        employeeList.appendChild(row);
    });
}

// Chờ tất cả các API hoàn tất
Promise.all([
    fetchDataAndAssignToArray('/api/nhanvien/', employees),
    fetchDataAndAssignToArray('/api/chinhanh/', ChiNhanhData),
    fetchDataAndAssignToArray('/api/cuahang/', CuaHangData),
    fetchDataAndAssignToArray('/api/khohang/', KhoHangData)
]).then(() => {
    console.log('Tất cả dữ liệu đã được tải');
    renderEmployeeList(employees);
    initializeSelectOptions();
}).catch(error => {
    console.error('Lỗi khi tải dữ liệu:', error);
});
// Tìm kiếm theo kho hàng, cửa hàng, chi nhánh ----------------------------------------------------------------
{
// Hiển thị phụ thuộc
    const chinhanhSelect = document.getElementById('chinhanh');
    const cuahangSelect = document.getElementById('cuahang');
    const khohangSelect = document.getElementById('khohang');
    function initializeSelectOptions() {
        let dataChiNhanh = `<option value="default">Chọn chi nhánh</option>`;
        ChiNhanhData.forEach(item => {
            dataChiNhanh += `<option value="${item.IDChiNhanh}">${item.TenChiNhanh}</option>`;
        });
        chinhanhSelect.innerHTML = dataChiNhanh;

        let dataCuaHang = `<option value="default">Chọn cửa hàng</option>`;
        CuaHangData.forEach(item => {
            dataCuaHang += `<option value="${item.IDCuaHang}">${item.TenCuaHang}</option>`;
        });
        cuahangSelect.innerHTML = dataCuaHang;

        let dataKhoHang = `<option value="default">Chọn kho hàng</option>`;
        KhoHangData.forEach(item => {
            dataKhoHang += `<option value="${item.MaKho}">${item.Ten}</option>`;
        });
        khohangSelect.innerHTML = dataKhoHang;
    }
    chinhanhSelect.addEventListener('change', function() {
        let dataKho = `<option value="default">Chọn Kho Hàng</option>`;
        let chinhanhCuaHang = `<option value="default">Chọn cửa hàng</option>`;

        if (chinhanhSelect.value !== 'default') {
            KhoHangData.forEach(item => {
                if (chinhanhSelect.value === item.MaCN) {
                    dataKho += `<option value="${item.MaKho}">Kho ${item.Ten}</option>`;
                }
            });
            CuaHangData.forEach(item => {
                if (chinhanhSelect.value === item.IDChiNhanh) {
                    chinhanhCuaHang += `<option value="${item.IDCuaHang}">${item.TenCuaHang}</option>`;
                }
            });
        } else {
            chinhanhCuaHang = `<option value="default">Chọn cửa hàng</option>`;
        }

        khohangSelect.innerHTML = dataKho;
        cuahangSelect.innerHTML = chinhanhCuaHang;
    });

    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
//Tìm kiếm và sắp xếp
    function filterAndSortObject(){
        let filterObject = employees;
        const searchValue = String(searchInput.value).toLowerCase().trim(); 

        if (searchValue) {
            filterObject = filterObject.filter(employee => {
                // Tìm theo tên
                if ((employee.Ho + employee.Ten).toLowerCase().includes(searchValue)) {
                    return true;
                }
                
                // Tìm theo giới tính
                if (searchValue === 'nam' || searchValue === 'nữ') {
                        if(searchValue.toLowerCase() === 'nam') {
                            return employee.GioiTinh.toLowerCase() === 'm';
                        }
                        else {
                            return employee.GioiTinh.toLowerCase() === 'f';
                        }
                }

                // Tìm theo các trường khác
                for (let key in employee) {
                    if (employee[key] != null && employee[key].toString().toLowerCase().includes(searchValue)) {
                        return true;
                    }
                }
        
                return false;
            });
        }
        
        // Lọc theo chi nhánh
        const chinhanhValue = chinhanhSelect.value;
        if (chinhanhValue !== 'default') {
            filterObject = filterObject.filter(employee => employee.IDChiNhanh == chinhanhValue);
        }

        // Lọc theo cửa hàng
        const cuahangValue = cuahangSelect.value;
        var idchinhanh = cuahangSelect.dataset.IDChiNhanh
        console.log(idchinhanh)
        
        
        if (cuahangValue !== 'default') {
            filterObject = filterObject.filter(employee => employee.IDCuaHang == cuahangValue);
        }

        // Lọc theo kho hàng
        const khohangValue = khohangSelect.value;
        if (khohangValue !== 'default') {
            if (chinhanhValue === 'default') {
                alert("Vui lòng chọn chi nhánh trước khi chọn kho hàng.");
                return;
            }
            filterObject = filterObject.filter(employee => (employee.IDKho == khohangValue && employee.IDChiNhanh == chinhanhValue) );
        }

        // sắp xếp
        const sortValue = sortSelect.value;
        if (sortValue) {
            const [key, order] = sortValue.split('-'); // tách thành tên và thứ tự
            filterObject.sort((a, b) => {
                // sắp xếp theo tên
                if (key == 'ten') {
                    const nameA = `${a.Ten}`;
                    const nameB = `${b.Ten}`;
                    if(order =='tang'){
                        return nameA.localeCompare(nameB) // trả về <0 nếu a < b
                    }else{
                        return nameB.localeCompare(nameA) 
                    }
                }
                // sắp xếp theo lương
                else if (key == 'luong') {
                    return order == 'tang' ? a.Luong - b.Luong : b.Luong - a.Luong;
                } else if (key == 'ngaydilam') {
                    console.log(new Date(a.NgayBatDauLam))
                    return order == 'tang' ? new Date(a.NgayBatDauLam) - new Date(b.NgayBatDauLam) : new Date(b.NgayBatDauLam) - new Date(a.NgayBatDauLam);
                }
                return 0;
            });
        }
        
        renderEmployeeList(filterObject)
    }
    searchInput.addEventListener('input', filterAndSortObject);
    sortSelect.addEventListener('change', filterAndSortObject);
    khohangSelect.addEventListener('change', filterAndSortObject);
    chinhanhSelect.addEventListener('change', filterAndSortObject);
    cuahangSelect.addEventListener('change', filterAndSortObject);
}
// ----------------------------------------------------------------

//Xem chi tiết nhân viên --------------------------------
{
    const employeeModal = document.getElementById('employee-modal');
    const employeeDetails = document.getElementById('employee-details');
    const closeModal = document.getElementById('close-details-modal');
    function showEmployeeDetails(id) {
        const employee = employees.find(emp => emp.MaNV == id);
        if (employee) {
            employeeDetails.innerHTML = `
                <table>
                    <tr>
                        <td>Mã Nhân Viên</td>
                        <td>${employee.MaNV}</td>
                    </tr>
                    <tr>
                        <td>CCCD</td>
                        <td>${employee.CCCD}</td>
                    </tr>
                    <tr>
                        <td>Họ</td>
                        <td>${employee.Ho}</td>
                    </tr>
                    <tr>
                        <td>Tên</td>
                        <td>${employee.Ten}</td>
                    </tr>
                    <tr>
                        <td>Ngày sinh</td>
                        <td>${employee.NamSinh}</td>
                    </tr>
                    <tr>
                        <td>Giới tính</td>
                        <td>${employee.GioiTinh}</td>
                    </tr>
                    <tr>
                        <td>Địa chỉ</td>
                        <td>${employee.DiaChi}</td>
                    </tr>
                    <tr>
                        <td>Chức vụ</td>
                        <td>${employee.ChucVu}</td>
                    </tr>
                    <tr>
                        <td>Lương</td>
                        <td>${employee.Luong}</td>
                    </tr>
                    <tr>
                        <td>Ngày đi làm</td>
                        <td>${employee.NgayBatDauLam}</td>
                    </tr>
                    <tr>
                        <td>Chi nhánh làm việc</td>
                        <td>${employee.IDKho}</td>
                    </tr>
                    <tr>
                        <td>Cửa hàng làm việc</td>
                        <td>${employee.IDCuaHang}</td>
                    </tr>
                    <tr>
                        <td>Chi nhánh làm việc</td>
                        <td>${employee.IDChiNhanh}</td>
                    </tr>
                </table>

            `;
            // document.getElementById('update-employee').setAttribute('data-id',id)
            // document.getElementById('delete-employee').setAttribute('data-id',id)

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
            const id = event.target.getAttribute('data-id');
            console.log('View details for:', id);  // Kiểm tra giá trị id
            if (id) {
                showEmployeeDetails(id);
            } else {
                console.error('Data-id is undefined or null');
            }
        }
    });
}
//----------------------------------------------------------------

/*
document.addEventListener('DOMContentLoaded', function() {

    // const addEmployeeButton = document.getElementById('add-employee');
    // const updateEmployeeButton = document.getElementById('update-employee');
    // const deleteEmployeeButton = document.getElementById('delete-employee');

    // const addEmployeeModal = document.getElementById('add-employee-modal');
    // const closeAddModal = document.getElementById('close-add-modal');
    // const addEmployeeForm = document.getElementById('add-employee-form');

    // const editEmployeeModal = document.getElementById('edit-employee-modal');
    // const closeEditModal = document.getElementById('close-edit-modal');
    // const editEmployeeForm = document.getElementById('edit-employee-form');



    // const itemsPerPage = 10; // Số lượng nhân viên hiển thị trên mỗi trang
    // let currentPage = 1;

// RENDER các giá trị mặc định
// FILTER






// RENDER ra màn hình

        // Cập nhật thông tin trang
    //     const pageInfo = document.getElementById('page-info');
    //     pageInfo.textContent = `${page} / ${Math.ceil(employeesList.length / itemsPerPage)}`;

    //     // Cập nhật trạng thái nút phân trang
    //     document.getElementById('prev-page').disabled = page === 1;
    //     document.getElementById('next-page').disabled = page === Math.ceil(employeesList.length / itemsPerPage);
    // }
    // // Sự kiện cho nút phân trang
    // document.getElementById('prev-page').addEventListener('click', () => {
    //     if (currentPage > 1) {
    //         currentPage--;
    //         renderEmployeeList(currentPage,employees);
    //     }
    // });

    // document.getElementById('next-page').addEventListener('click', () => {
    //     if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
    //         currentPage++;
    //         renderEmployeeList(currentPage,employees);
    //     }
    // });

    

    // // Xem thông tin chi tiết của object

    
    // // XÓA NHÂN VIÊN
    // deleteEmployeeButton.onclick = function() {
    //     const ID = deleteEmployeeButton.getAttribute('data-id')
    //     const employeeIndex = employees.findIndex(emp => emp.id == ID);
    //     alert(employeeIndex)
    //     if (employeeIndex !== -1) // tìm được index
    //     {
    //         // Xóa nhân viên khỏi danh sách
    //         // Cập nhập trên database TODO

    //         // test fake DATA
    //         employees.splice(employeeIndex, 1);
    //         alert('Xóa nhân viên thành công!');
    //         employeeModal.style.display = 'none'; // Đóng modal chi tiết
    //         renderEmployeeList(currentPage,employees); // Cập nhật lại danh sách nhân viên

    //     }
    //     else{
    //         alert("Nhân viên không tồn tại")
    //     }
    // };

    
    // // Thêm nhân viên
    // addEmployeeButton.onclick = function() {
    //     addEmployeeModal.style.display = 'block';
    // };
    
    // closeAddModal.onclick = function() {
    //     addEmployeeModal.style.display = 'none';
    // };
    
    // window.onclick = function(event) {
    //     if (event.target === addEmployeeModal) {
    //         addEmployeeModal.style.display = 'none';
    //     }
    // };
    // addEmployeeForm.addEventListener("submit", async function (event) {
    //     event.preventDefault();
        
    //     const newEmployee = {
    //         id: employees.length + 1, // Tạo ID mới
    //         maNhanVien: "NV"+(100 + employees.length+1),
    //         ho: document.getElementById('ho').value,
    //         ten: document.getElementById('ten').value,
    //         ngaysinh: document.getElementById('Ngaysinh').value,
    //         gioitinh: document.getElementById('gioitinh').value,
    //         email:document.getElementById('email').value,
    //         sdt:document.getElementById('SĐT').value,
    //         stk:document.getElementById('STK').value,
    //         diachi:document.getElementById('diachi').value,
    //         ngaydilam:document.getElementById('Ngaydilam').value,
    //         chucVu: document.getElementById('chucVu').value,
    //         luong: parseFloat(document.getElementById('luong').value),
    //         cuahang: document.getElementById('cuahang').value,
    //         chinhanh: document.getElementById('chinhanh').value
    //     };
    //     try {
    //         //Thêm vào db
    //         // TODO
    //         employees.push(newEmployee)
    //         console.log(employees)
    //         alert("Thêm thành công")
    //         addEmployeeModal.style.display = 'none'
    //         renderEmployeeList(currentPage,employees)
    //     } catch (error) {
    //         alert("Thêm thất bại")
    //     }
    //     // Gửi dữ liệu đến server
    // });
    
    // // EDIT NHÂN VIÊN

    // updateEmployeeButton.onclick = function() {
    //     employeeModal.style.display = 'none';
    //     editEmployeeModal.style.display = 'block';
    //     const ID = updateEmployeeButton.getAttribute('data-id');
    //     let employee;
    //     for (let emp of employees){
    //         if(emp.id == ID){
    //             employee = emp;
    //             break;
    //         }
    //     }
    //     if(employee){
    //         editEmployeeForm.innerHTML = `
    //         <input type="hidden" id="edit-id" value = ${employee.MaNV}>
    //         <label for="edit-ho">Họ:</label>
    //         <input type="text" id="edit-ho" value = "${employee.Ho}" required>
    //         <label for="edit-ten">Tên:</label>
    //         <input type="text" id="edit-ten" value = "${employee.Ten}"required>
    //         <label for="edit-gioitinh">Giới Tính:</label>
    //         <input type="text" id="edit-ten" value = "${employee.Gioitinh}"required>
    //         <label for="edit-Ngaysinh">Ngày sinh:</label>
    //         <input type="date" id="edit-Ngaysinh" value = "${employee.Namsinh}" required>
    //         <label for="edit-gioitinh">Giới Tính:</label>
    //         <select id="edit-gioitinh">
    //             <option value="Nam">Nam</option>
    //             <option value="Nữ">Nữ</option>
    //         </select>
    //         <label for="edit-SĐT">SĐT:</label>
    //         <input type="number" id="edit-SĐT" value = "${employee.sdt}" required>
    //         <label for="edit-STK">STK:</label>
    //         <input type="number" id="edit-STK" value = "${employee.stk}" required>
    //         <label for="edit-email">Email:</label>
    //         <input type="email" id="edit-email" value = "${employee.email}" required>
    //         <label for="edit-diachi">Địa chỉ:</label>
    //         <input type="text" id="edit-diachi" value = "${employee.diachi}" required>
    //         <label for="edit-Ngaydilam">Ngày đi làm:</label>
    //         <input type="date" id="edit-Ngaydilam" value = "${employee.ngaydilam}" required>

    //         <label for="edit-chucVu">Chức Vụ:</label>
    //         <input type="text" id="edit-chucVu" value = "${employee.chucVu}" required>
    //         <label for="edit-luong">Lương:</label>
    //         <input type="number" id="edit-luong" value = "${employee.luong}" required>
    //         <label for="edit-cuahang">Cửa hàng làm việc:</label>
    //         <input type="text" id="edit-cuahang" value = "${employee.cuahang}" required>
    //         <label for="chinhanh">Chi Nhánh:</label>
    //         <input type="text" id="edit-chinhanh" value = "${employee.chinhanh}" required>
    //         <button type="submit">Cập Nhật Nhân Viên</button>
    //         `;
    //     }
    //     else{
    //         alert("khong tìm được")
    //     }
    // };
    // editEmployeeForm.addEventListener("submit", async function(event){
    //     event.preventDefault();
    //     ID = document.getElementById('edit-id').value;
    //     const empIndex = employees.findIndex(emp => emp.id == ID)

    //     employees[empIndex].ho = document.getElementById('edit-ho').value;
    //     employees[empIndex].ten = document.getElementById('edit-ten').value;
    //     employees[empIndex].namsinh = document.getElementById('edit-Ngaysinh').value;
    //     employees[empIndex].gioitinh = document.getElementById('edit-gioitinh').value;
    //     employees[empIndex].email =document.getElementById('edit-email').value;
    //     employees[empIndex].sdt =document.getElementById('edit-SĐT').value;
    //     employees[empIndex].stk =document.getElementById('edit-STK').value;
    //     employees[empIndex].diachi =document.getElementById('edit-diachi').value;
    //     employees[empIndex].ngaydilam =document.getElementById('edit-Ngaydilam').value;
    //     employees[empIndex].chucVu = document.getElementById('edit-chucVu').value;
    //     employees[empIndex].luong = parseFloat(document.getElementById('edit-luong').value);
    //     employees[empIndex].cuahang = document.getElementById('edit-cuahang').value;
    //     employees[empIndex].chinhanh = document.getElementById('edit-chinhanh').value;

    //     editEmployeeModal.style.display = 'none';
    //     alert("cập nhập thành công")
    //     renderEmployeeList(currentPage,employees)
    //     // Gửi tới server
    // })
    // closeEditModal.onclick = function() {
    //     editEmployeeModal.style.display = 'none';
    // }
    
    // window.onclick = function(event) {
    //     if (event.target === editEmployeeModal) {
    //         editEmployeeModal.style.display = 'none';
    //     }
    // }
    
    // console.log(employees)
    // renderEmployeeList(employees);
});
*/
// async function deleteEmployee(maNV) {
//     try {
//         const response = await fetch(`/nhanvien/${maNV}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert(`Thành công: ${result.message}`);
//         } else {
//             alert(`Thất bại: ${result.message || 'Có lỗi xảy ra'}`);
//         }
//     } catch (error) {
//         console.error('Lỗi khi gọi API xóa nhân viên:', error);
//         alert('Có lỗi xảy ra. Vui lòng thử lại!');
//     }
// }
// // Hàm thêm nhân viên
// async function addEmployee(maNV, tenNV, chucVu) {
//     try {
//         const response = await fetch('/nhanvien', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ MaNV: maNV, TenNV: tenNV, ChucVu: chucVu }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert(`Thành công: ${result.message}`);
//         } else {
//             alert(`Thất bại: ${result.message || 'Có lỗi xảy ra'}`);
//         }
//     } catch (error) {
//         console.error('Lỗi khi gọi API thêm nhân viên:', error);
//         alert('Có lỗi xảy ra. Vui lòng thử lại!');
//     }
// }

// // Gọi hàm khi người dùng click vào nút xóa
// document.querySelectorAll('.delete-btn').forEach((btn) => {
//     btn.addEventListener('click', (e) => {
//         const maNV = e.target.dataset.manv; // Lấy mã nhân viên từ thuộc tính data-manv
//         if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${maNV}?`)) {
//             deleteEmployee(maNV);
//         }
//     });
// });

// // Gọi hàm khi người dùng nhấn nút Thêm
// document.querySelector('#addEmployeeForm').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const maNV = document.querySelector('#MaNV').value;
//     const tenNV = document.querySelector('#TenNV').value;
//     const chucVu = document.querySelector('#ChucVu').value;

//     addEmployee(maNV, tenNV, chucVu);
// });
