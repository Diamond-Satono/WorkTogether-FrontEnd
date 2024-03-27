document.addEventListener('DOMContentLoaded', function() {
    // Select the submenu parent link
    var submenuParent = document.querySelector('.submenu > a');
    submenuParent.addEventListener('click', function() {
        // Find the nested submenu
        var submenu = this.nextElementSibling;
        // Toggle the 'active' class on the parent li
        this.parentElement.classList.toggle('active');

        // Rotate the arrow icon
        var arrow = this.querySelector('.arrow');
        if (this.parentElement.classList.contains('active')) {
        arrow.classList.remove('fa-chevron-right');
        arrow.classList.add('fa-chevron-down');
        } else {
        arrow.classList.remove('fa-chevron-down');
        arrow.classList.add('fa-chevron-right');
        }
    });

    // 选择查询按钮
    var queryButton = document.querySelector('.btn-primary');

    // 添加点击事件监听器
    queryButton.addEventListener('click', function () {
        // 获取输入框中的关键字
        var keyword = document.querySelector('.search-box input[type="text"]').value.trim().toLowerCase();
    
        // 获取所有的表格行
        var rows = document.querySelectorAll('tbody tr');
    
        // 遍历每一行
        rows.forEach(function (row) {
            // 获取当前行的角色名称单元格的内容
            var roleName = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
    
            // 如果角色名称包含关键字，则显示该行，否则隐藏该行
            if (roleName.includes(keyword)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
            });
        });

    //get userList info
    fetch('http://localhost:8080/api/user/company/1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tableBody = document.querySelector('table tbody');
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.id}</td>
                    <td>${data.name}</td>
                    <td>${data.email}</td>
                    <td>${data.createTime}</td>
                    <td>${data.lastLoginTime}</td>
                    <td><input class="ios-switch" type="checkbox" ${data.status ? 'checked' : ''}></td>
                    <td class="button-container">
                        <button class="assign_roles">分配角色</button>
                        <button class="edit_button">编辑</button>
                        <button class="delete_button">删除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    //update user status

    // 为所有复选框添加点击事件监听器
    const checkboxes = document.querySelectorAll('.ios-switch');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            var id = this.parentElement.parentElement.querySelector('td:first-child').textContent;  // 获取所在行的id
            var status = this.checked ? 1 : 0;  // 根据复选框状态设置新的status值

            // 准备要发送的数据
            const newData = {
                id: id,
                status: status
            };

            // 向API发送POST请求
            fetch('http://localhost:8080/api/user/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Status updated successfully:', data);
                alert("修改状态成功");
            })
            .catch(error => console.error('Error updating status:', error));
        });
    });
});