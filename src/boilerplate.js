const date = new Date();


function boilerPlate(name){
    return `/**
 *    author: ${name}
 *    created: ${date}
**/
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define endl "\\n"
#define yes cout << "YES\\n";
#define no cout << "NO\\n";
#define all(x) x.begin(),x.end()
#define pb push_back
#define FOR(i,a,b) for (int i = (a); i < (b); ++i)
#define F0R(i,a) FOR(i,0,a)
#define ROF(i,a,b) for (int i = (b)-1; i >= (a); --i)
#define R0F(i,a) ROF(i,0,a)
#define rep(a) F0R(_,a)
#define each(a,x) for (auto& a: x)
#define vec vector
#define dbg(x) cout << #x << " is " << x << endl;
long long MOD = 1e9 + 7;

void solve(){
    
}

signed main() {
    ios_base::sync_with_stdio(false); 
    cin.tie(NULL);
    #ifndef ONLINE_JUDGE 
    freopen("inputf.in", "r", stdin); 
    freopen("outputf.out", "w", stdout); 
    #endif
    int tst = 1;
    cin >> tst;
    while (tst--) {
        solve();
    }
    return 0;
}`;

}
module.exports = boilerPlate;