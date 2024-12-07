
const employees = [];
    const ChiNhanhData = [];
    const CuaHangData = [];
    const KhoHangData = [];
  
async function deleteEmployee(maNV) {
    try {
        const response = await fetch(`/api/nhanvien/delete/${maNV}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (response.ok) {
            alert(`Thành công: ${result.message}`);
        } else {
            alert(`Thất bại: ${result.message || 'Có lỗi xảy ra'}`);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API xóa nhân viên:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
}
const fetchDataAndAssignToArray = (apiUrl, targetArray) => {
    return fetch(apiUrl) // Thêm return ở đây
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Kết quả API:', result);
            const items = result.data; 
            if (!Array.isArray(items)) {
                throw new Error('Dữ liệu trả về không phải là mảng!');
            }
            targetArray.push(...items);
            console.log('Dữ liệu đã gán:', targetArray);
        });
};
// Tải dữ liệu từ db lên
async function loadData(){
    try{

        await fetchDataAndAssignToArray('/api/nhanvien/', employees),
        await fetchDataAndAssignToArray('/api/chinhanh/', ChiNhanhData),
        await fetchDataAndAssignToArray('/api/cuahang/', CuaHangData),
        await fetchDataAndAssignToArray('/api/khohang/', KhoHangData)
    }
    catch(error){
        console.log("Lỗi khi tải dữ liệu:",error)
    }
}


document.addEventListener('DOMContentLoaded', async function(){
    
    await loadData();
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
    
    const chinhanhSelect = document.querySelector('#filter-chinhanh');
    const cuahangSelect = document.querySelector('#filter-cuahang');
    const khohangSelect = document.querySelector('#filter-khohang');
   
    const add_chinhanhSelect = document.querySelector('#add-chinhanh');
    const add_cuahangSelect = document.querySelector('#add-cuahang');
    const add_khohangSelect = document.querySelector('#add-khohang');
    
    const itemsPerPage = 6; // Số lượng nhân viên hiển thị trên mỗi trang
    let currentPage = 1;
        
    // RENDER các giá trị mặc định
     // FILTER
    dataChinhanh = ''
    ChiNhanhData.forEach(item => {
        dataChinhanh += `<option value="${item.IDChiNhanh}"> ${item.TenChiNhanh} </option>` 
    })
    chinhanhSelect.innerHTML += dataChinhanh
    add_chinhanhSelect.innerHTML+=dataChinhanh

    dataCuaHang = `<option value="default">Chọn cửa hàng</option>`
    CuaHangData.forEach(item => {
        dataCuaHang += `<option value="${item.IDCuaHang}"> ${item.TenCuaHang} </option>` 
    })
    cuahangSelect.innerHTML = dataCuaHang
    add_cuahangSelect.innerHTML = dataCuaHang

// Thêm logic cho select
    chinhanhSelect.addEventListener('change', function() {
        dataKho = `<option value="default">Chọn Kho Hàng</option>`
        chinhanh_cuahang = `<option value="default">Chọn cửa hàng</option>`
        if(chinhanhSelect.value !== 'default'){
            KhoHangData.forEach(item => {
                if(chinhanhSelect.value === item.MaCN){
                    dataKho += `<option value="${item.MaKho}">Kho ${item.Ten} </option>` 
                }
            })
            CuaHangData.forEach(item => {
                if(chinhanhSelect.value === item.IDChiNhanh){
                    chinhanh_cuahang += `<option value="${item.IDCuaHang}"> ${item.TenCuaHang} </option>` 
                }
            })
        }
        else chinhanh_cuahang = dataCuaHang
        khohangSelect.innerHTML = dataKho
        cuahangSelect.innerHTML = chinhanh_cuahang
    });
// logic cho add select
/* Nếu chọn cửa hàng thì chi nhánh và kho hàng = NULL*/
/* Nếu chọn chi nhánh thì cửa hàng là null và kho hàng có thể là null*/

add_chinhanhSelect.addEventListener('change',function(){
    if(add_chinhanhSelect.value !== 'default'){
        add_cuahangSelect.innerHTML = `<option value="default"> Null </option>`
        dataKho=''
        KhoHangData.forEach(item => {
            if(add_chinhanhSelect.value === item.MaCN){
                dataKho += `<option value="${item.MaKho}">Kho ${item.Ten} </option>` 
            }
        })
        add_khohangSelect.innerHTML = `<option value="default"> Chọn kho </option>` + dataKho
    }
    else{
        add_cuahangSelect.innerHTML = dataCuaHang
    }
})
add_cuahangSelect.addEventListener('change',function(){
    if(add_cuahangSelect.value !== 'default'){
        add_chinhanhSelect.innerHTML = `<option value="default"> Null </option>`
        add_khohangSelect.innerHTML = `<option value="default"> Null </option>`
    }else{
    add_chinhanhSelect.innerHTML= `<option value="default"> Null </option>` + dataChinhanh

    }
})
    
    // RENDER ra màn hình
    function renderEmployeeList(page, employeesList) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        employeeList.innerHTML = '';
        const currentEmployees = employeesList.slice(startIndex, endIndex);
        currentEmployees.forEach(employee => {
            // Lấy tên chi nhánh, cửa hàng, kho hàng từ mảng dữ liệu
            const chiNhanh = ChiNhanhData.find(cn => cn.IDChiNhanh == employee.IDChiNhanh);
            const cuaHang = CuaHangData.find(ch => ch.IDCuaHang == employee.IDCuaHang);
            const khoHang = KhoHangData.find(kh => kh.MaKho == employee.IDKho);
    
            const tenChiNhanh = chiNhanh ? chiNhanh.TenChiNhanh : '';
            const tenCuaHang = cuaHang ? cuaHang.TenCuaHang : '';
            const tenKhoHang = khoHang ? khoHang.Ten : '';
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.MaNV}</td>
                <td>${employee.Ho}</td>
                <td>${employee.Ten}</td>
                <td>${employee.GioiTinh}</td>
                <td>${employee.ChucVu}</td>
                <td>${tenCuaHang}</td>
                <td>${tenKhoHang}</td>
                <td>${tenChiNhanh}</td>
                <td><button class="view-details" data-id="${employee.MaNV}">Chi Tiết</button></td>
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
            if (searchValue) {
                filterObject = filterObject.filter(employee => {
                    // Tìm theo tên
                    if ((employee.Ho + " " + employee.Ten).toLowerCase().includes(searchValue)) {
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
            // console.log(idchinhanh)
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
            renderEmployeeList(currentPage,filterObject)
        }
        
        searchInput.addEventListener('input', filterAndSortObject);
        sortSelect.addEventListener('change', filterAndSortObject);
        khohangSelect.addEventListener('change', filterAndSortObject);
        chinhanhSelect.addEventListener('change', filterAndSortObject);
        cuahangSelect.addEventListener('change', filterAndSortObject);
        

        // Xem thông tin chi tiết của object
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
                document.getElementById('update-employee').setAttribute('data-id',id)
                document.getElementById('delete-employee').setAttribute('data-id',id)
                employeeModal.style.display = 'block';
            }
        }
        
        closeModal.onclick = function() {
            employeeModal.style.display = 'none';
        }
        
        // window.onclick = function(event) {
        //     if (event.target !== employeeModal) {
        //         employeeModal.style.display = 'none';
        //     }
        // }
        
        employeeList.addEventListener('click', function(event) {
            if (event.target.classList.contains('view-details')) {
                const id = (event.target.getAttribute("data-id"));
                showEmployeeDetails(id);
            }
        });

        
        // XÓA NHÂN VIÊN
        deleteEmployeeButton.onclick = async function() {
            const ID = deleteEmployeeButton.getAttribute('data-id')
            const employeeIndex = employees.findIndex(emp => emp.MaNV == ID);
            if (employeeIndex !== -1) // tìm được index
            {
                // Xóa nhân viên khỏi danh sách
                // Cập nhập trên database TODO
            
                await deleteEmployee(ID)
                // alert('Xóa nhân viên thành công!');
                employeeModal.style.display = 'none'; // Đóng modal chi tiết
                location.reload()
                // renderEmployeeList(currentPage,employees); // Cập nhật lại danh sách nhân viên
            }
            else{
                alert("Nhân viên không tồn tại")
            }
        };
        
        
        // Thêm nhân viên
        addEmployeeButton.onclick = function() {
            addEmployeeModal.style.display = 'block';
            // let lastEmp = parseInt(employees[employees.length - 1].MaNV.slice(2))    
            // document.getElementById('maNV').value = "NV" + (lastEmp+1).toString().padStart(4,'0')
        };
        
        closeAddModal.onclick = function() {
            addEmployeeModal.style.display = 'none';
        };
        
        // window.onclick = function(event) {
        //     if (event.target == addEmployeeModal) {
        //         addEmployeeModal.style.display = 'none';
        //     }
        // };
        // addEmployeeForm.addEventListener("submit", async function (event) {

        //     const newEmployee = {
        //         MaNV: document.getElementById('maNV').value,
        //         Ho: document.getElementById('ho').value,
        //         Ten: document.getElementById('ten').value,
        //         NamSinh: document.getElementById('Ngaysinh').value,
        //         GioiTinh: document.getElementById('gioitinh').value,
        //         Email:document.getElementById('email').value,
        //         sdt:document.getElementById('SĐT').value,
        //         stk:document.getElementById('STK').value,
        //         DiaChi:document.getElementById('diachi').value,
        //         NgayBatDauLam:document.getElementById('Ngaydilam').value,
        //         ChucVu: document.getElementById('chucVu').value,
        //         Luong: parseFloat(document.getElementById('luong').value),
        //         IDCuaHang: document.getElementById('add-cuahang').value,
        //         IDChiNhanh: document.getElementById('add-chinhanh').value,
        //         IDKho: document.getElementById('add-khohang').value
        //     };
        //     try {
        //         //Thêm vào db
        //         await addEmployee(newEmployee.MaNV, newEmployee.Ten, newEmployee.ChucVu)
        //         // TODO
        //         alert("Thêm thành công")
        //         addEmployeeModal.style.display = 'none'
        //         location.reload()
        //         // renderEmployeeList(currentPage,employees)
        //     } catch (error) {
        //         alert("Thêm thất bại")
        //     }
        //     // Gửi dữ liệu đến server
        // });
        
        // EDIT NHÂN VIÊN
        
        updateEmployeeButton.onclick = function() {
            employeeModal.style.display = 'none';
            editEmployeeModal.style.display = 'block';
            const ID = updateEmployeeButton.getAttribute('data-id');
            let employee;
            for (let emp of employees){
                if(emp.MaNV == ID){
                    employee = emp;
                    break;
                }
            }
            if(employee){
                editEmployeeForm.innerHTML = `
                <label for="edit-ho">Họ:</label>
                <input type="text" id="edit-ho" value = "${employee.Ho}" required>
                <label for="edit-ten">Tên:</label>
                <input type="text" id="edit-ten" value = "${employee.Ten}"required>
                <label for="edit-gioitinh">Giới Tính:</label>
                <input type="text" id="edit-ten" value = "${employee.GioiTinh}"required>
                <label for="edit-Ngaysinh">Ngày sinh:</label>
                <input type="text" id="edit-Ngaysinh" value = "${employee.NamSinh}" required>
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
                <input type="text" id="edit-diachi" value = "${employee.DiaChi}" required>
                <label for="edit-Ngaydilam">Ngày đi làm:</label>
                <input type="date" id="edit-Ngaydilam" value = "${Date(employee.NgayBatDauLam)}" required>
                
                <label for="edit-chucVu">Chức Vụ:</label>
                <input type="text" id="edit-chucVu" value = "${employee.ChucVu}" required>
                <label for="edit-luong">Lương:</label>
                <input type="number" id="edit-luong" value = "${employee.Luong}" required>
                <label for="edit-chinhanh">Cửa hàng làm việc:</label>
                <input type="text" id="edit-chinhanh" value = "${employee.IDChiNhanh}" required>
                <label for="chinhanh">Chi Nhánh:</label>
                <input type="text" id="edit-cuahang" value = "${employee.IDCuaHang}" required>
                <label for="chinhanh">Kho:</label>
                <input type="text" id="edit-kho" value = "${employee.IDKho}" required>
                <button type="submit">Cập Nhật Nhân Viên</button>
                `;
            }
            else{
                alert("khong tìm được")
            }
        };
        editEmployeeForm.addEventListener("submit", function(event){
            event.preventDefault();
            const ID = updateEmployeeButton.getAttribute('data-id');
            const empIndex = employees.findIndex(emp => emp.MaNV == ID)
            
            employees[empIndex].Ho = document.getElementById('edit-ho').value;
            employees[empIndex].Ten = document.getElementById('edit-ten').value;
            employees[empIndex].NamSinh = document.getElementById('edit-Ngaysinh').value;
            employees[empIndex].GioiTinh = document.getElementById('edit-gioitinh').value;
            employees[empIndex].email =document.getElementById('edit-email').value;
            employees[empIndex].sdt =document.getElementById('edit-SĐT').value;
            employees[empIndex].stk =document.getElementById('edit-STK').value;
            employees[empIndex].DiaChi =document.getElementById('edit-diachi').value;
            employees[empIndex].NgayBatDauLam =document.getElementById('edit-Ngaydilam').value;
            employees[empIndex].ChucVu = document.getElementById('edit-chucVu').value;
            employees[empIndex].Luong = parseFloat(document.getElementById('edit-luong').value);
            employees[empIndex].IDCuaHang = document.getElementById('edit-cuahang').value;
            employees[empIndex].IDChiNhanh = document.getElementById('edit-chinhanh').value;
            employees[empIndex].IDKho = document.getElementById('edit-kho').value;

            
            editEmployeeModal.style.display = 'none';
            // alert("cập nhập thành công")
            // Gửi tới server
            updateEmployee(empIndex);
            renderEmployeeList(currentPage,employees)
        })
        closeEditModal.onclick = function() {
            editEmployeeModal.style.display = 'none';
        }
        
        // window.onclick = function(event) {
        //     if (event.target === editEmployeeModal) {
        //         editEmployeeModal.style.display = 'none';
        //     }
        // }
        
        console.log(employees)
        renderEmployeeList(currentPage,employees);
}); 

// Function to add a new employee
async function addEmployee() {

    const newEmployee = {
        maNV: document.getElementById('maNV').value,
        cccd: document.getElementById('cccdnv').value,
        ho: document.getElementById('ho').value,
        ten: document.getElementById('ten').value,
        ngaysinh: document.getElementById('Ngaysinh').value,
        gioitinh: document.getElementById('gioitinh').value,
        sdt: document.getElementById('SĐT').value,
        stk: document.getElementById('STK').value,
        email: document.getElementById('email').value,
        diachi: document.getElementById('diachi').value,
        chucVu: document.getElementById('chucVu').value,
        ngaydilam: document.getElementById('Ngaydilam').value,
        luong: document.getElementById('luong').value,
        idChiNhanh: document.getElementById('add-chinhanh').value,
        idCuaHang: document.getElementById('add-cuahang').value,
        idKho: document.getElementById('add-khohang').value,
    };
    // for (const key in newEmployee) {
    //     if (newEmployee.hasOwnProperty(key)) {
    //         console.log(`${key}: ${newEmployee[key]}`);
    //     }
    // }
    if(newEmployee.idChiNhanh == "default") {
        newEmployee.idChiNhanh = null;
    }
    if(newEmployee.idCuaHang == "default") {
        newEmployee.idCuaHang = null;
    }
    if(newEmployee.idKho == "default") {
        newEmployee.idKho = null;
    }
    if(newEmployee.gioitinh == "Nam") {
        newEmployee.gioitinh = "M";
    }
    if(newEmployee.gioitinh == "Nữ") {
        newEmployee.gioitinh = "F";
    }
    try {
        const response = await fetch('/api/nhanvien/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(`Thành công: ${result.message}`);
        } else {
            alert(`Thất bại: ${result.message || 'Có lỗi xảy ra'}`);
        }
        location.reload();
    } catch (error) {
        console.error('Lỗi khi gọi API thêm nhân viên:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    //     if (data.message === 'Employee added successfully') {
    //         alert('Thêm nhân viên thành công');
    //         loadData();  // Reload data after adding
    //     } else {
    //         alert('Có lỗi khi thêm nhân viên');
    //     }
    // })
    // .catch(error => {
    //     console.error('Error adding employee:', error);
    // });
}

// Event listener for form submission
document.getElementById('add-employee-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addEmployee();
});

// Function to update an employee
async function updateEmployee(empIndex) {

    const newEmployee = {
        maNV: employees[empIndex].MaNV,
        ho:  employees[empIndex].Ho,
        ten: employees[empIndex].Ten,
        ngaysinh: employees[empIndex].NamSinh,
        gioitinh: employees[empIndex].GioiTinh,
        sdt: employees[empIndex].sdt,
        stk: employees[empIndex].stk,
        email: employees[empIndex].email,
        diachi: employees[empIndex].DiaChi,
        chucVu: employees[empIndex].ChucVu,
        ngaydilam: employees[empIndex].NgayBatDauLam,
        luong: employees[empIndex].Luong,
        idChiNhanh: employees[empIndex].IDChiNhanh,
        idCuaHang: employees[empIndex].IDCuaHang,
        idKho: employees[empIndex].IDKho,
    };

    // for (const key in newEmployee) {
    //     if (newEmployee.hasOwnProperty(key)) {
    //         console.log(`${key}: ${newEmployee[key]}`);
    //     }
    // }
    if(newEmployee.idChiNhanh == "null") {
        newEmployee.idChiNhanh = null;
    }
    if(newEmployee.idCuaHang == "null") {
        newEmployee.idCuaHang = null;
    }
    if(newEmployee.idKho == "null") {
        newEmployee.idKho = null;
    }
    if(newEmployee.gioitinh == "Nam") {
        newEmployee.gioitinh = "M";
    }
    if(newEmployee.gioitinh == "Nữ") {
        newEmployee.gioitinh = "F";
    }
    try {
        const response = await fetch('/api/nhanvien/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(`Thành công: ${result.message}`);
        } else {
            alert(`Thất bại: ${result.message || 'Có lỗi xảy ra'}`);
        }
        // location.reload();
    } catch (error) {
        console.error('Lỗi khi gọi API cập nhật nhân viên:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
}

// document.querySelector(".logout-button").addEventListener("click", async function(){
//     await location.reload();
// });
