<!DOCTYPE html>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang="en">

<head>
    <title>DCAT Harvester Admin</title>
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/bootstrap.min.css"
    >
</head>

<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <h1>DCAT Harvester Admin</h1>

            <p>
                You are logged in as <b>${username}</b>. <a class="btn btn-default"
                                                            href="${pageContext.request.contextPath}/login?logout"
                                                            role="button">
                Log out </a>
                <a class="btn btn-primary"
                   href="${pageContext.request.contextPath}/admin" role="button">
                    DCAT Sources Admin</a>
            </p>
        </div>
    </div>


    <div class="row">
        <div class="col-md-12">
            <div class="alert alert-danger" role="alert" id="errors"></div>

        </div>
    </div>

    <div class="row">

        <div class="col-md-3">

            <c:set var="editUser" value="${editUser}"/>

            <input type="hidden" id="inputUserId" value="${editUser.getId()}"></input>

            <div class="form-group">
                <label for="inputUsername">Username</label> <input type="text"
                                                                   class="form-control" id="inputUsername"
                                                                   placeholder="Username"
                                                                   value="${editUser.username}"></input>
            </div>
            <div class="form-group">
                <label for="inputPassword">Password</label> <input type="password"
                                                                   class="form-control" id="inputPassword"
                                                                   placeholder="Password"></input>
            </div>
            <div class="form-group">
                <label for="inputEmail">Email</label> <input type="email"
                                                             class="form-control" id="inputEmail" placeholder="Email"
                                                             value="${editUser.email}"></input>
            </div>
            <div class="form-group">
                <label for="inputRole">Role</label> <select
                    class="form-control" id="inputRole">
                <option value="USER" ${editUser.role == 'USER' ? 'selected="selected"' : ''}>USER</option>
                <option value="ADMIN" ${editUser.role == 'ADMIN' ? 'selected="selected"' : ''}>ADMIN</option>
            </select>
            </div>

            <button class="btn btn-default" type="button" onclick="saveUser();">
				<span class="glyphicon glyphicon-floppy-save" aria-hidden="true">
					Save</span>
            </button>

            <a class="btn btn-default" href="${pageContext.request.contextPath}/admin/users" role="button">Clear</a>

        </div>

        <div class="col-md-9">

            <c:if test="${not empty users}">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach var="user" items="${users}">
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td><a class="btn btn-default"
                                   href="${pageContext.request.contextPath}/admin/users?edit=${user.username}"
                                   role="button"> <span
                                    class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                            </a></td>
                            <td><a class="btn btn-default" onclick="deleteUser('${user.username}');"
                                   role="button"> <span
                                    class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </a></td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </c:if>

        </div>

    </div>

</div>


<script src="${pageContext.request.contextPath}/js/scripts.js" type="text/javascript"></script>
<script type="text/javascript">
    var saveUser = function () {
        var userid = document.getElementById('inputUserId').value;
        var username = document.getElementById('inputUsername').value;
        var password = document.getElementById('inputPassword').value;
        var email = document.getElementById('inputEmail').value;
        var role = document.getElementById('inputRole').value;

        var data = {
            'userid': userid,
            'username': username,
            'password': password,
            'email': email,
            'role': role
        };

        sendRequest('POST', '${pageContext.request.contextPath}/api/admin/user', data);
    };

    var deleteUser = function (username) {
        sendRequest('DELETE', '${pageContext.request.contextPath}/api/admin/user?delete=' + username, null);
    };

    clearErrors();
</script>

</body>
</html>