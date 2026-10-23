
FROM gradle:8.7-jdk21

WORKDIR /app

COPY . .

RUN gradle clean bootJar --no-daemon

EXPOSE 8080

CMD ["sh", "-c", "JAR=$(find build/libs -maxdepth 1 -type f -name '*.jar' ! -name '*-plain.jar' | head -n 1); if [ -z \"$JAR\" ]; then echo 'Executable JAR not found'; exit 1; fi; exec java -Dserver.port=${PORT:-8080} -jar \"$JAR\""]
