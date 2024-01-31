precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
#define MAX_STEPS 100
#define SURFACE_DIST 0.001
#define MAX_DIST 100.0

mat4 RotationX(float angle) {
  return mat4(1.0, 0, 0, 0,
    0, cos(angle), - sin(angle), 0,
    0, sin(angle), cos(angle), 0,
  0, 0, 0, 1);
}

mat4 RotationY(float angle) {
  return mat4(cos(angle), 0, sin(angle), 0,
  0, 1.0, 0, 0,
  - sin(angle), 0, cos(angle), 0,
0, 0, 0, 1);
}

mat4 RotationZ(float angle) {
return mat4(cos(angle), - sin(angle), 0, 0,
sin(angle), cos(angle), 0, 0,
0, 0, 1, 0,
0, 0, 0, 1);
}

mat2 Rot2d(float a) {
float s = sin(a);
float c = cos(a);
return mat2(c, - s, s, c);
}

float sdSphere(vec3 p, vec4 sphere) {
return length(p - sphere.xyz) - sphere.w;
}

float sdBox(vec3 p, vec3 box) {
p = abs(p) - box;
return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float sdGyroid(vec3 p, float scale, float thickness, float bias) {
p *= scale;
return abs(dot(sin(p), cos(p.zxy)) + bias) / scale - thickness;
}
vec3 Transform(vec3 p) {
p.zx *= Rot2d(p.z * 0.055);
p.xy *= Rot2d(p.z * 0.15);
//p.z += vec3((vec4(p,0.)*RotationZ(2.)).xyz).z;
p = vec3((vec4(p, 0) * RotationZ(u_time / 5.0)).xyz);

p.z += u_time * 0.2;
p.y -= 0.3;
p.x += 0.5;
return p;
}
float GetDist(vec3 p) {
//float box = sdSphere(p, vec4(vec3(0),1.4));
// p = abs(p);
p = Transform(p);
float box = sdBox(p, vec3(1.0));
//float planed=p.y;
float g1 = sdGyroid(p, 5.23, 0.05, 1.4);
float g2 = sdGyroid(p, 10.76, 0.03, 0.3);
float g3 = sdGyroid(p, 20.76, 0.03, 0.3);
float g4 = sdGyroid(p, 35.76, 0.03, 0.3);
float g5 = sdGyroid(p, 60.73, 0.03, 0.3);
float g6 = sdGyroid(p, 131.26, 0.03, 0.3);
float g7 = sdGyroid(p, 242.446, 0.01, 0.13);
//float g = max(g1, -g2);
g1 += g2 * 0.1;
g1 -= g3 * 0.51;
g1 -= g4 * 0.1;
g1 -= g5 * 0.1;
g1 -= g6 * 0.2;
g1 -= g7 * 0.2;
// float gyroid2 = sdGyroid(p-.1, 21.);
float d = g1 * 0.8;
// d = max(d-.05, gyroid2);
return d;
}

vec3 GetNormal(vec3 p) {
vec2 e = vec2(0.02, 0);
float d = GetDist(p);
vec3 n = d-vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));
return normalize(n);
}

float RayMarch(vec3 ro, vec3 rd) {
float dO = 0.0;
for(int i = 0; i < MAX_STEPS; i ++ ) {
vec3 p = ro + dO * rd;
float ds = GetDist(p);
dO += ds;
if (dO < SURFACE_DIST||dO > MAX_DIST) {
  break;
}
}
return dO;
}

float Blinn(vec3 lightPos, vec3 fragPos, vec3 cameraPos, vec3 normal, float exp) {
  vec3 lightDir = normalize(lightPos - fragPos);
  vec3 viewDir = normalize(cameraPos - fragPos);
  vec3 h = normalize(lightDir - viewDir);
  return pow(max(dot(normal, h), 0.0), exp);
}

float GetLight(vec3 p, vec3 cameraPos, float specularity) {
  vec4 lpos = vec4(10, 10, 0, 1);
  lpos *= RotationZ(u_time);
  vec3 l = normalize(lpos.xyz - p);
  vec3 n = GetNormal(p);
  float diff = dot(n, l) * 0.5 + 0.5;
  float d = RayMarch(p + n*0.02, l);
  float spec = Blinn(lpos.xyz, p, - cameraPos, n, 32.0);
  if (d < length(lpos.xyz - p)) {
    diff *= 0.1;
    spec *= 0.1;
  }
  return diff + spec * 41.;
}


vec3 fresnelSlick(float cosTheta, vec3 col) {
  return col + (1.0 - col) * pow(1.0 - cosTheta, 5.0);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l - p),
  r = normalize(cross(vec3(0, 1, 0), f)),
  u = cross(f, r),
  c = p+f * z,
  i = c+uv.x * r+uv.y * u,
  d = normalize(i - p);
  return d;
}

vec3 Fog(vec3 rd) {
  float t = u_time / 1.0;
  vec3 col = vec3(0);
  float y = rd.y * 0.5 + 0.5;
  col += (1.0 - y) * vec3(1.0, 0.4, 0.1);
  float a = atan(rd.x, rd.z);
  float b = atan(rd.y, rd.z);
  float c = atan(rd.y, rd.x);
  float flames = sin(a * 10.0 + t) * sin(a * 17.0 - t) * sin(a * 6.0 + t*2.0);
  flames += cos(b * 1.0 + t*2.0) * cos(b * 7.0 - t / 2.0) * cos(b * 16.0 - t*3.0);
  //flames += cos(c*10.+t)*cos(c*7.-t)*cos(c*6.);
  flames *= smoothstep(0.8, 0.5, y);
  //flames -= smoothstep(.55,.6,rd.z*.5+.5);
  col += flames * (sin(t) * 0.5 + 0.5) * 0.4;
  col = max(col, 0.0);
  col += smoothstep(0.5, 0.0, y);
  return col;
}


vec3 render(vec2 uv) {
  vec3 color = vec3(0);
  float t = u_time / 5.0;
  uv += 0.003 * sin(uv * 40.0);
  vec2 m = u_mouse.xy / u_resolution.xy;

  // camera
  vec3 ro = vec3(0, 0, - 0.01);

  //ro.yz *= Rot2d(t/4.*3.14+1.);
  //ro.xz *= Rot2d(t/5.*6.2831);

  vec3 lookAt = vec3(0, 0, 0);
  vec3 rd = GetRayDir(uv, ro, lookAt, 0.8);

  // trace scene
  float d = RayMarch(ro, rd);

  // material
  if (d < MAX_DIST) {
  vec3 p = ro + rd * d;
  vec3 n = GetNormal(p);
  float height = p.y;
  float dif = n.y * 0.5 + 0.5;
  //float dif = GetLight(p, ro, 1.);
  color += dif * dif;
  //color += n*.5+.5;
  p = Transform(p);
  float g2 = sdGyroid(p, 10.76, 0.03, 0.3);
  float g13 = sdGyroid(p + t, 5.76, 0.03, 0.0);
  float g14 = sdGyroid(p - t*0.5, 5.76, 0.03, 0.0);
  float g3 = sdGyroid(p, 20.76, 0.03, 0.3);
  float g4 = sdGyroid(p, 35.76, 0.03, 0.3);
  float g5 = sdGyroid(p, 60.76, 0.03, 0.3);
  color *= smoothstep(-0.1, 0.01, g2);
  color -= 1.4 - smoothstep(-0.1, 0.01, g3);
  color *= smoothstep(-0.1, 0.01, g4);
  float crackWidth =- 0.02 + smoothstep(0.0, - 0.5, n.y) * 0.02;
  float cracks = smoothstep(crackWidth, - 0.03, g2);
  cracks += smoothstep(crackWidth, - 0.03, g3);
  cracks *= g13 * g14 * 20.0 + 0.2 * smoothstep(0.2, 0.0, n.y);

  color += cracks * vec3(1, 0.4, 0.1) * 3.0;
  color += smoothstep(0.0, - 2.0, height) * vec3(1, 0.4, 0.1);
  // color *= smoothstep(-.1, .02, g3);
  // color *= smoothstep(-.1, .02, g4);
  // color *= smoothstep(-.1, .02, g5);
  //color = Fog(rd) ;
  color *= vec3(0.2 * n+vec3(1.0, 0.4, 0.2));
  color = mix(color, Fog(rd), smoothstep(0.0, 7.0, d));

  }
  color *= pow(1.0 - dot(uv, uv), 4.0);
  return color;
}


void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  vec3 color = render(uv);
  const int mSize = 11;
  const int kSize = (mSize - 1) / 2;
  float kernel[mSize];
  vec3 final_colour = vec3(0.0);
  vec2 tex_offset = 1.0 / vec2(u_resolution.xy);
  float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(color, 1);
}