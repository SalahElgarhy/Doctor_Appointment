# Docker Setup Guide

## 📦 Docker Deployment

This project includes Docker and Docker Compose configuration for easy deployment.

### Prerequisites

- Docker (v20.10+)
- Docker Compose (v1.29+)
- Or use Docker Desktop which includes both

### Quick Start

#### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/SalahElgarhy/Doctor_Appointment.git
   cd Doctor_Appointment
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your configuration**
   ```env
   PORT=3000
   NODE_ENV=production
   
   # Database
   DB_HOST=mysql
   DB_USER=doctor_user
   DB_PASSWORD=secure_password
   DB_PORT=3306
   DB_NAME=Doctor_Appointment
   
   # Security
   JWT_SECRET_KEY=your_super_secret_key
   ENCRYPTION_KEY=your_encryption_key_32_chars_min
   
   # Email
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@doctorappointment.com
   ```

4. **Start all services**
   ```bash
   docker-compose up -d
   ```

5. **Check if services are running**
   ```bash
   docker-compose ps
   ```

6. **View application logs**
   ```bash
   docker-compose logs -f app
   ```

7. **Access the application**
   - API: http://localhost:3000

#### Option 2: Using Docker Only

1. **Build the image**
   ```bash
   docker build -t doctor-appointment:latest .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name doctor_appointment \
     -p 3000:3000 \
     -e DB_HOST=your_db_host \
     -e DB_USER=your_db_user \
     -e DB_PASSWORD=your_db_password \
     -e DB_NAME=Doctor_Appointment \
     -e JWT_SECRET_KEY=your_secret \
     -e ENCRYPTION_KEY=your_encryption_key \
     -e EMAIL_USER=your_email \
     -e EMAIL_PASSWORD=your_password \
     -v $(pwd)/uploads:/app/uploads \
     doctor-appointment:latest
   ```

### Docker Compose Services

#### MySQL Database
- **Image**: mysql:8.0
- **Port**: 3306 (configurable)
- **Volume**: mysql_data (persists data)
- **Health Check**: Enabled

#### Node.js Application
- **Image**: Custom built from Dockerfile
- **Port**: 3000 (configurable)
- **Volumes**: 
  - uploads/ (persists uploaded files)
  - src/ (for development hot-reload)
- **Health Check**: Enabled

### Database Initialization

The `init.sql` file automatically creates:
- users table
- doctors table
- departments table
- appointments table
- audit_logs table (optional)

Run manually if needed:
```bash
docker-compose exec mysql mysql -u root -p < init.sql
```

### Environment Variables

All configuration through `.env`:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=mysql          # Use 'mysql' when using docker-compose
DB_USER=doctor_user
DB_PASSWORD=secure_password
DB_PORT=3306
DB_NAME=Doctor_Appointment

# JWT
JWT_SECRET_KEY=your_secret_key_min_32_chars
JWT_EXPIRE_TIME=7d

# Encryption
ENCRYPTION_KEY=your_encryption_key_min_32_chars

# Email (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password
EMAIL_FROM=noreply@doctorappointment.com
```

### Useful Docker Commands

**View running containers**
```bash
docker-compose ps
```

**View logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs mysql

# Follow logs
docker-compose logs -f
```

**Stop services**
```bash
docker-compose stop
```

**Start services**
```bash
docker-compose start
```

**Restart services**
```bash
docker-compose restart
```

**Remove services**
```bash
docker-compose down

# Remove with volumes (WARNING: Deletes database data)
docker-compose down -v
```

**Access MySQL directly**
```bash
docker-compose exec mysql mysql -u root -p -D Doctor_Appointment
```

**Execute shell in app container**
```bash
docker-compose exec app sh
```

**Rebuild image after code changes**
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Volumes

#### mysql_data
- Persists MySQL database
- Located at `docker_mysql_data` on host

#### uploads
- Stores user uploaded files
- Mounted to `./uploads` directory
- Persists across container restarts

### Networking

Services communicate via `doctor_network` bridge network:
- App connects to MySQL using `mysql` hostname
- Internal communication on port 3306
- External access only through published ports

### Production Deployment

For production deployment:

1. **Use environment-specific configuration**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Set strong passwords**
   - Change all default passwords in `.env`
   - Use secure random strings

3. **Enable HTTPS**
   - Add reverse proxy (Nginx)
   - Set up SSL certificates

4. **Set proper resource limits**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

5. **Use external database**
   - Don't run MySQL in container for production
   - Use managed database service (RDS, etc)

### Troubleshooting

**Container won't start**
```bash
docker-compose logs app
# Check logs for errors
```

**Database connection failed**
```bash
# Wait for MySQL to be ready
docker-compose up -d mysql
sleep 10
docker-compose up -d app
```

**Port already in use**
```bash
# Change port in .env
PORT=3001
docker-compose up -d
```

**Permission denied for volumes**
```bash
# Fix permissions
docker-compose exec app chown -R nodejs:nodejs /app/uploads
```

**Want to reset everything**
```bash
docker-compose down -v
docker-compose up -d
```

### Security Notes

- ✅ Non-root user (nodejs) runs the app
- ✅ Health checks enabled
- ✅ Proper signal handling with dumb-init
- ✅ Database password protected
- ✅ Volume permissions managed
- ⚠️ Never commit `.env` file with real credentials
- ⚠️ Always use strong passwords in production

### Performance Tips

1. Use `.dockerignore` to exclude unnecessary files
2. Multi-stage builds reduce image size
3. Use Alpine Linux for smaller images
4. Set resource limits for containers
5. Use named volumes for better performance

### Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

For more information, see [README.md](README.md)
