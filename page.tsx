 "use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard, Factory, Package, ShoppingCart, Wallet, FileText,
  Plus, ArrowUpRight, ArrowDownRight, Menu, X, CircleDollarSign,
  Boxes, ReceiptText, ChevronRight
} from "lucide-react";

type Tx = { name:string; meta:string; amount:number; type:"in"|"out" };
type Batch = {no:string; date:string; raw:number; finished:number; operator:string};

const transactions:Tx[] = [
  {name:"Penjualan arang", meta:"INV-0012 · Hari ini", amount:7200000, type:"in"},
  {name:"Pembelian tempurung", meta:"PO-0021 · Hari ini", amount:3500000, type:"out"},
  {name:"Biaya produksi", meta:"Batch PRD-0817-01", amount:1250000, type:"out"},
];

const rupiah=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

export default function Home(){
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState("Dashboard");
  const [showProduction,setShowProduction]=useState(false);
  const [rawInput,setRawInput]=useState(2000);
  const [finishedInput,setFinishedInput]=useState(600);
  const [materialCost,setMaterialCost]=useState(4000000);
  const [laborCost,setLaborCost]=useState(500000);
  const [energyCost,setEnergyCost]=useState(350000);
  const [overheadCost,setOverheadCost]=useState(250000);
  const [operator,setOperator]=useState("Operator 1");
  const [batches,setBatches]=useState<Batch[]>([
    {no:"PRD-0817-01",date:"17 Agu 2026",raw:2000,finished:600,operator:"Operator 1"},
    {no:"PRD-0816-02",date:"16 Agu 2026",raw:2000,finished:540,operator:"Operator 2"},
    {no:"PRD-0815-01",date:"15 Agu 2026",raw:2000,finished:720,operator:"Operator 1"}
  ]);
  const shrinkInput=Math.max(rawInput-finishedInput,0);
  const yieldInput=rawInput>0?(finishedInput/rawInput)*100:0;
  const shrinkInputPct=rawInput>0?(shrinkInput/rawInput)*100:0;
  const totalProductionCost=materialCost+laborCost+energyCost+overheadCost;
  const hppKg=finishedInput>0?totalProductionCost/finishedInput:0;
  const [rawKg,setRawKg]=useState(2000);
  const [finishedKg,setFinishedKg]=useState(600);
  const shrinkKg=Math.max(rawKg-finishedKg,0);
  const shrinkPct=rawKg>0?(shrinkKg/rawKg)*100:0;
  const yieldPct=rawKg>0?(finishedKg/rawKg)*100:0;
  const nav=[
    ["Dashboard",LayoutDashboard],["Produksi",Factory],["Stok",Package],
    ["Penjualan",ShoppingCart],["Pembelian",Boxes],["Kas & Bank",Wallet],
    ["Laporan",FileText]
  ];
  const stats=useMemo(()=>[
    ["Omzet bulan ini", "Rp 250.000.000", CircleDollarSign],
    ["Laba bersih", "Rp 48.500.000", ArrowUpRight],
    ["Produksi bulan ini", "18.500 kg", Factory],
    ["Stok arang", "12.300 kg", Package],
  ],[]);

  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 hover:bg-gray-100 md:hidden" onClick={()=>setOpen(true)}><Menu size={22}/></button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white font-bold">PA</div>
          <div><div className="font-bold">Portal Manajemen Arang</div><div className="text-xs text-gray-500">Operasional & Keuangan</div></div>
        </div>
        <div className="hidden items-center gap-3 md:flex"><span className="text-sm text-gray-500">Owner</span><div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">O</div></div>
      </div>
    </header>

    {open && <div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={()=>setOpen(false)}>
      <aside className="h-full w-72 bg-white p-4" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between mb-5"><b>Menu</b><button onClick={()=>setOpen(false)}><X/></button></div>
        <Nav items={nav} active={active} setActive={(x)=>{setActive(x);setOpen(false)}}/>
      </aside>
    </div>}

    <div className="mx-auto flex max-w-7xl">
      <aside className="hidden w-64 shrink-0 p-4 md:block"><Nav items={nav} active={active} setActive={setActive}/></aside>
      <main className="w-full min-w-0 p-4 pb-24 md:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div><h1 className="text-2xl font-bold">{active}</h1><p className="mt-1 text-sm text-gray-500">Ringkasan bisnis hari ini.</p></div>
          <button className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm"><Plus size={18}/> Transaksi</button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([label,value,Icon]:any)=><div className="card p-4" key={label}>
            <div className="flex items-center justify-between"><span className="text-xs text-gray-500">{label}</span><Icon size={18} className="text-green-700"/></div>
            <div className="mt-2 text-lg font-bold">{value}</div>
          </div>)}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between"><div><h2 className="font-bold">Arus bisnis</h2><p className="text-xs text-gray-500">6 bulan terakhir</p></div><ChevronRight size={18} className="text-gray-400"/></div>
            <div className="mt-5 flex h-44 items-end gap-2 sm:gap-4">
              {[45,62,54,78,68,92].map((h,i)=><div className="flex flex-1 flex-col items-center gap-2" key={i}>
                <div className="w-full rounded-t-lg bg-green-200" style={{height:`${h}%`}}/>
                <span className="text-[11px] text-gray-500">{["Mar","Apr","Mei","Jun","Jul","Agu"][i]}</span>
              </div>)}
            </div>
          </section>

          <section className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="font-bold">Penyusutan bahan baku → barang jadi</h2>
              <p className="text-xs text-gray-500">Masukkan berat batch untuk melihat rendemen.</p></div>
              <Factory size={19} className="text-green-700"/>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs text-gray-500">Bahan baku (kg)
                <input type="number" min="0" value={rawKg} onChange={e=>setRawKg(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border p-3 text-sm text-gray-900 outline-none focus:border-green-600"/>
              </label>
              <label className="text-xs text-gray-500">Barang jadi (kg)
                <input type="number" min="0" value={finishedKg} onChange={e=>setFinishedKg(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border p-3 text-sm text-gray-900 outline-none focus:border-green-600"/>
              </label>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm"><span>Bahan baku</span><b>{rawKg.toLocaleString("id-ID")} kg</b></div>
              <div className="h-5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-gray-500" style={{width:"100%"}} />
              </div>
              <div className="flex items-center justify-between text-sm"><span>Penyusutan</span><b className="text-red-600">{shrinkKg.toLocaleString("id-ID")} kg ({shrinkPct.toFixed(1)}%)</b></div>
              <div className="h-5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-red-400" style={{width:`${Math.min(shrinkPct,100)}%`}} />
              </div>
              <div className="flex items-center justify-between text-sm"><span>Barang jadi / rendemen</span><b className="text-green-700">{finishedKg.toLocaleString("id-ID")} kg ({yieldPct.toFixed(1)}%)</b></div>
              <div className="h-5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-green-600" style={{width:`${Math.min(yieldPct,100)}%`}} />
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-bold">Produksi terbaru</h2>
            <div className="mt-4 space-y-4">
              {[["PRD-0817-01","600 kg","Rendemen 30%"],["PRD-0816-02","540 kg","Rendemen 27%"],["PRD-0815-01","720 kg","Rendemen 32%"]].map(x=><div className="flex items-center justify-between" key={x[0]}>
                <div><div className="text-sm font-semibold">{x[0]}</div><div className="text-xs text-gray-500">{x[2]}</div></div><b className="text-sm">{x[1]}</b>
              </div>)}
            </div>
          </section>
        </div>

        <section className="card mt-4 overflow-hidden">
          <div className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold">Transaksi terbaru</h2><p className="text-xs text-gray-500">Aktivitas keuangan</p></div><button className="text-sm font-semibold text-green-700">Lihat semua</button></div>
          <div>{transactions.map(t=><div className="flex items-center justify-between border-b p-4 last:border-0" key={t.name}>
            <div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.type==="in"?"bg-green-50 text-green-700":"bg-red-50 text-red-600"}`}>{t.type==="in"?<ArrowUpRight size={18}/>:<ArrowDownRight size={18}/>}</div><div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-gray-500">{t.meta}</div></div></div>
            <span className={`text-sm font-bold ${t.type==="in"?"text-green-700":"text-red-600"}`}>{t.type==="in"?"+":"-"}{rupiah(t.amount)}</span>
          </div>)}</div>
        </section>

        <section className="card mt-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="font-bold">Analisis rendemen produksi</h2><p className="text-xs text-gray-500">Perbandingan hasil jadi setiap batch.</p></div>
            <button onClick={()=>setShowProduction(true)} className="flex items-center gap-2 rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white"><Plus size={17}/> Batch baru</button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Metric label="Rata-rata rendemen" value={`${(batches.reduce((a,b)=>a+(b.raw?b.finished/b.raw*100:0),0)/batches.length).toFixed(1)}%`}/>
            <Metric label="Batch terbaik" value={`${Math.max(...batches.map(b=>b.raw?b.finished/b.raw*100:0)).toFixed(1)}%`}/>
            <Metric label="Batch" value={`${batches.length}`}/>
          </div>
          <div className="mt-5 space-y-4">
            {batches.map(b=>{
              const y=b.raw?b.finished/b.raw*100:0;
              return <div key={b.no}>
                <div className="mb-1 flex justify-between text-xs"><span className="font-semibold">{b.no} · {b.date}</span><span className="font-bold text-green-700">{y.toFixed(1)}% rendemen</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-green-600" style={{width:`${Math.min(y,100)}%`}}/></div>
                <div className="mt-1 text-[11px] text-gray-500">{b.raw.toLocaleString("id-ID")} kg → {b.finished.toLocaleString("id-ID")} kg · susut {(b.raw-b.finished).toLocaleString("id-ID")} kg · {b.operator}</div>
              </div>
            })}
          </div>
        </section>

        {showProduction && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={()=>setShowProduction(false)}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl" onClick={e=>e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">Batch produksi baru</h2><p className="text-xs text-gray-500">Pencatatan bahan baku sampai barang jadi.</p></div><button onClick={()=>setShowProduction(false)} className="rounded-xl p-2 hover:bg-gray-100"><X size={20}/></button></div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bahan baku (kg)" value={rawInput} setValue={setRawInput}/>
              <Field label="Barang jadi (kg)" value={finishedInput} setValue={setFinishedInput}/>
              <Field label="Biaya bahan" value={materialCost} setValue={setMaterialCost}/>
              <Field label="Tenaga kerja" value={laborCost} setValue={setLaborCost}/>
              <Field label="Energi / BBM" value={energyCost} setValue={setEnergyCost}/>
              <Field label="Overhead" value={overheadCost} setValue={setOverheadCost}/>
            </div>
            <label className="mt-3 block text-xs text-gray-500">Operator
              <input value={operator} onChange={e=>setOperator(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"/>
            </label>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-gray-50 p-3"><div className="text-[11px] text-gray-500">Susut</div><b>{shrinkInput.toLocaleString("id-ID")} kg</b><div className="text-xs text-red-600">{shrinkInputPct.toFixed(1)}%</div></div>
              <div className="rounded-xl bg-green-50 p-3"><div className="text-[11px] text-gray-500">Rendemen</div><b>{yieldInput.toFixed(1)}%</b></div>
              <div className="rounded-xl bg-gray-50 p-3"><div className="text-[11px] text-gray-500">HPP/kg</div><b>{rupiah(hppKg)}</b></div>
            </div>
            <button onClick={()=>{
              const nextNo=`PRD-${String(batches.length+1).padStart(4,"0")}`;
              setBatches([{no:nextNo,date:"Hari ini",raw:rawInput,finished:finishedInput,operator},...batches]);
              setShowProduction(false);
            }} className="mt-5 w-full rounded-xl bg-green-700 py-3 font-semibold text-white">Simpan batch</button>
          </div>
        </div>}
      </main>
    </div>

    <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t bg-white md:hidden">
      {nav.slice(0,5).map(([name,Icon]:any)=><button key={name} onClick={()=>setActive(name)} className={`flex flex-col items-center gap-1 py-2 text-[10px] ${active===name?"text-green-700":"text-gray-500"}`}><Icon size={19}/>{name}</button>)}
    </nav>
  </div>
}

function Metric({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-gray-50 p-3"><div className="text-xs text-gray-500">{label}</div><div className="mt-1 font-bold">{value}</div></div>}
function Field({label,value,setValue}:{label:string;value:number;setValue:(n:number)=>void}){return <label className="text-xs text-gray-500">{label}<input type="number" min="0" value={value} onChange={e=>setValue(Number(e.target.value))} className="mt-1 w-full rounded-xl border p-3 text-sm text-gray-900 outline-none focus:border-green-600"/></label>}

function Nav({items,active,setActive}:{items:any[];active:string;setActive:(x:string)=>void}){
 return <div className="space-y-1">{items.map(([name,Icon])=><button key={name} onClick={()=>setActive(name)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active===name?"bg-green-50 text-green-700":"text-gray-600 hover:bg-gray-50"}`}><Icon size={19}/>{name}</button>)}</div>
}