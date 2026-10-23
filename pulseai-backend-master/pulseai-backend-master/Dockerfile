
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x pulseai-backend-master/pulseai-backend-master/gradlew \
    && cd pulseai-backend-master/pulseai-backend-master \
    && ./gradlew clean bootJar --no-daemon

EXPOSE 8080

CMD ["sh", "-c", "JAR=$(find /app/pulseai-backend-master/pulseai-backend-master/build/libs -maxdepth 1 -name '*.jar' ! -name '*-plain.jar' | head -n 1); exec java -Dserver.port=${PORT:-8080} -jar \"$JAR\""]
