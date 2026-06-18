import re
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from .models import Project, ContactMessage

@require_http_methods(["GET"])
def projects_list(request):
    projects = Project.objects.all()
    project_list = []
    for project in projects:
        project_list.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'tags': project.tags,
            'github': project.github_url,
            'demo': project.demo_url
        })
    return JsonResponse(project_list, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def contact_submit(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({
            "status": "error",
            "code": "INVALID_JSON",
            "message": "Server Validation Error: Invalid JSON payload."
        }, status=400)

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()

    print("[API Server] Received transmission attempt...")

    # Basic validations
    if not name:
        return JsonResponse({
            "status": "error",
            "code": "MISSING_NAME",
            "message": "Server Validation Error: Name field is required."
        }, status=400)

    if not email:
        return JsonResponse({
            "status": "error",
            "code": "MISSING_EMAIL",
            "message": "Server Validation Error: Email field is required."
        }, status=400)

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return JsonResponse({
            "status": "error",
            "code": "INVALID_EMAIL",
            "message": "Server Validation Error: Email address structure is invalid."
        }, status=400)

    if not message:
        return JsonResponse({
            "status": "error",
            "code": "MISSING_MESSAGE",
            "message": "Server Validation Error: Message payload is required."
        }, status=400)

    # Save to SQLite database
    msg = ContactMessage.objects.create(
        name=name,
        email=email,
        message=message
    )

    print("-----------------------------------------------")
    print(f"From:    {msg.name} <{msg.email}>")
    print(f"Date:    {msg.created_at.isoformat()}")
    print(f"Payload: {msg.message}")
    print("-----------------------------------------------")
    print("[API Server] Message Logged Successfully!")

    return JsonResponse({
        "status": "success",
        "code": "TRANSMISSION_ACKNOWLEDGED",
        "message": "Secure transaction complete. Message payload acknowledged by server.",
        "receivedData": {
            "name": msg.name,
            "timestamp": msg.created_at.isoformat()
        }
    })

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    user = authenticate(request, username=email, password=password)
    if user is not None:
        return JsonResponse({
            "status": "success",
            "token": f"mock-token-{user.id}-secure-session",
            "user": {
                "username": user.username,
                "email": user.email
            }
        })
    else:
        return JsonResponse({
            "status": "error",
            "message": "Invalid email or password credentials."
        }, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def project_create(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    tags_raw = data.get('tags', [])
    github_url = data.get('github', '').strip()
    demo_url = data.get('demo', '').strip()
    
    if not title or not description:
        return JsonResponse({"status": "error", "message": "Title and description are required fields."}, status=400)
        
    if isinstance(tags_raw, str):
        tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
    else:
        tags = tags_raw
        
    project = Project.objects.create(
        title=title,
        description=description,
        tags=tags,
        github_url=github_url or "https://github.com",
        demo_url=demo_url or "#"
    )
    
    return JsonResponse({
        "status": "success",
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "tags": project.tags,
            "github": project.github_url,
            "demo": project.demo_url
        }
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def project_delete(request, pk):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Project not found."}, status=404)
        
    project.delete()
    return JsonResponse({"status": "success", "message": f"Project {pk} successfully deleted."})

@csrf_exempt
@require_http_methods(["GET"])
def messages_list(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    messages = ContactMessage.objects.all().order_by('-created_at')
    message_list = []
    for msg in messages:
        message_list.append({
            "id": msg.id,
            "name": msg.name,
            "email": msg.email,
            "message": msg.message,
            "timestamp": msg.created_at.isoformat()
        })
        
    return JsonResponse(message_list, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def profile_update(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    try:
        # Extract user ID from token f"mock-token-{user.id}-secure-session"
        token_parts = auth_header.split('-')
        user_id = int(token_parts[2])
    except (IndexError, ValueError):
        return JsonResponse({"status": "error", "message": "Invalid token session"}, status=401)
        
    try:
        from django.contrib.auth.models import User
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"status": "error", "message": "User session not found"}, status=404)
        
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        
    new_username = data.get('username', '').strip()
    new_email = data.get('email', '').strip()
    new_password = data.get('password', '')
    
    if not new_email or not new_username:
        return JsonResponse({"status": "error", "message": "Username and Email are required fields."}, status=400)
        
    # Check if email is already taken by another user
    if User.objects.filter(email=new_email).exclude(pk=user.id).exists():
        return JsonResponse({"status": "error", "message": "This email address is already taken by another administrator."}, status=400)

    # Check if username is already taken by another user
    if User.objects.filter(username=new_username).exclude(pk=user.id).exists():
        return JsonResponse({"status": "error", "message": "This username is already taken by another administrator."}, status=400)
        
    user.username = new_username
    user.email = new_email
    
    if new_password:
        user.set_password(new_password)
        
    user.save()
    
    return JsonResponse({
        "status": "success",
        "message": "Administrator profile successfully updated.",
        "user": {
            "username": user.username,
            "email": user.email
        }
    })

@csrf_exempt
@require_http_methods(["POST", "PUT"])
def project_update(request, pk):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Project not found."}, status=404)
        
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    tags_raw = data.get('tags', [])
    github_url = data.get('github', '').strip()
    demo_url = data.get('demo', '').strip()
    
    if not title or not description:
        return JsonResponse({"status": "error", "message": "Title and description are required fields."}, status=400)
        
    if isinstance(tags_raw, str):
        tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
    else:
        tags = tags_raw
        
    project.title = title
    project.description = description
    project.tags = tags
    project.github_url = github_url or "https://github.com"
    project.demo_url = demo_url or "#"
    project.save()
    
    return JsonResponse({
        "status": "success",
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "tags": project.tags,
            "github": project.github_url,
            "demo": project.demo_url
        }
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def message_delete(request, pk):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer mock-token-'):
        return JsonResponse({"status": "error", "message": "Unauthorized access"}, status=401)
        
    try:
        message = ContactMessage.objects.get(pk=pk)
    except ContactMessage.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Message not found."}, status=404)
        
    message.delete()
    return JsonResponse({"status": "success", "message": f"Message {pk} successfully deleted."})

