#!/bin/sh

#
# Gradle start up script for POSIX generated for Señal CI/local builds.
#

# Attempt to set APP_HOME
app_path=$0
while [ -h "$app_path" ]; do
  ls=$(ls -ld "$app_path")
  link=${ls#*' -> '}
  case $link in
    /*) app_path=$link ;;
    *) app_path=$(dirname "$app_path")/$link ;;
  esac
done
APP_HOME=$(cd "$(dirname "$app_path")" && pwd -P) || exit

APP_NAME="Gradle"
APP_BASE_NAME=${0##*/}
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# OS specific support
cygwin=false
msys=false
darwin=false
nonstop=false
case "$(uname)" in
  CYGWIN*) cygwin=true ;;
  Darwin*) darwin=true ;;
  MSYS*|MINGW*) msys=true ;;
  NONSTOP*) nonstop=true ;;
esac

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

if [ -n "$JAVA_HOME" ]; then
  if [ -x "$JAVA_HOME/jre/sh/java" ]; then
    JAVACMD=$JAVA_HOME/jre/sh/java
  else
    JAVACMD=$JAVA_HOME/bin/java
  fi
  if [ ! -x "$JAVACMD" ]; then
    echo "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME" >&2
    exit 1
  fi
else
  JAVACMD=java
  which java >/dev/null 2>&1 || {
    echo "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH." >&2
    exit 1
  }
fi

# Escape application args
save() {
  for i do printf %s\\n "$i" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/' \\\\/"; done
  echo " "
}
APP_ARGS=$(save "$@")

eval set -- $DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS \
  "\"-Dorg.gradle.appname=$APP_BASE_NAME\"" \
  -classpath "\"$CLASSPATH\"" \
  org.gradle.wrapper.GradleWrapperMain \
  "$APP_ARGS"

exec "$JAVACMD" "$@"
