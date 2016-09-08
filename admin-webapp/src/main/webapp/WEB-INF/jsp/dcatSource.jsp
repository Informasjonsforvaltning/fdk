<!DOCTYPE html>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang="en">

<head>
    <title>DCAT Source</title>
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/bootstrap.min.css"
    >
</head>

<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">


            <h1>DCAT Source</h1>
            <c:if test="${dcatSource != null}">

            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Description</th>
                    <th>URL</th>
                </tr>
                </thead>
                <tbody>
                <td>${dcatSource.id}</td>
                <td>${dcatSource.description}</td>
                <td>${dcatSource.url}</td>
                </tbody>
            </table>

            <div>

            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">

            <h3>Harvest History (100 last harvests) -
                <a target="_blank" href="${kibanaLink.getFirstHalf()}${dcatSource.getIdUrlEncoded()}${kibanaLink.getSecondHalf()}">
                    Se mer i Kibana (link)
                </a>
            </h3>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                <c:forEach var="harvest" items="${dcatSource.getHarvestedLast100()}">
                    <tr>
                        <td style="min-width: 120px">${harvest.getCreatedDateFormatted()}</td>
                        <td>${harvest.status.getLocalName()}</td>
                        <td><c:out value="${harvest.getMessageOrEmpty()}"/></td>
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
    var saveDcatSource = function () {
        var id = document.getElementById('inputId').value;
        var description = document.getElementById('inputDescription').value;
        var url = document.getElementById('inputUrl').value;

        var data = {
            'id': id,
            'description': description,
            'url': url,
            'user': '${username}'
        };

        sendRequest('POST', '${pageContext.request.contextPath}/api/admin/dcat-source', data);
    };

    var deleteDcatSource = function (dcatSourceId) {
        sendRequest('DELETE', '${pageContext.request.contextPath}/api/admin/dcat-source?delete=' + dcatSourceId, null);
    };

    clearErrors();
</script>

</body>
</html>