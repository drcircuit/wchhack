#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
#define ITERATIONS 512

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
  uv*=2.4;
  uv.x -=.5;
  vec3 color=.5+.5*cos(u_time+uv.xyx+vec3(0,2,4));
  vec2 c=vec2(uv.x, uv.y);
  vec2 z=c;
  float numi;
  float zs=0.;
  for(int i=0;i<ITERATIONS;i++){
    float tempx=z.x*z.x-z.y*z.y+c.x;
    z.y=2.*z.y*z.x+c.y;
    z.x=tempx;
    zs=length(z);
    
    if(length(z)>2.){
      numi=float(i);
      break;
    }
  }
  if(zs<2.){
    color += tan(zs)/4.;
  }else{
    float f=(numi+log2(zs))/float(ITERATIONS);
    color.r+=sin(.3-f);
    color.g+=sin(.1-f);
    color.b+=sin(.4-f);
  }
  gl_FragColor=vec4(color,1.);
}