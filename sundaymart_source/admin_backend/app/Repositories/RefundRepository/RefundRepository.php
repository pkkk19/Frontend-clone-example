<?php

namespace App\Repositories\RefundRepository;


use App\Models\Refund;
use App\Repositories\CoreRepository;

class RefundRepository extends CoreRepository
{
    private $lang;

    public function __construct()
    {
        parent::__construct();
        $this->lang = $this->setLanguage();
    }

    protected function getModelClass()
    {
        return Refund::class;
    }

    // get list product
    public function paginate($perPage, $shop = null)
    {
        return $this->model->whereHas('order', function ($q) use ($shop) {
            $q->where('shop_id', $shop->id);
        })->select('order_id', 'user_id', 'status', 'image')->paginate($perPage);
    }

    public function show(int $id)
    {
        return $this->model()->with([
            'order',
            'user'
        ])->find($id);
    }

    public function statisticsShop($shop = null)
    {
        return \DB::table('refunds as r')->select(\DB::raw(
            "sum(case when (r.status='pending') then 1 else 0 end) as count_pending_refunds,
                   sum(case when (r.status='canceled') then 1 else 0 end) as count_canceled_refunds,
                   sum(case when (r.status='accepted') then 1 else 0 end) as count_accepted_refunds"
        ))
            ->join('orders as o','o.id','=','r.order_id')
            ->where('o.shop_id',$shop->id)
            ->whereNull('r.deleted_at')
            ->first();
    }

    public function statisticsAdmin($shop = null)
    {

        return \DB::table('refunds as r')->select(\DB::raw(
            "sum(case when (r.status='pending') then 1 else 0 end) as count_pending_refunds,
                   sum(case when (r.status='canceled') then 1 else 0 end) as count_canceled_refunds,
                   sum(case when (r.status='accepted') then 1 else 0 end) as count_accepted_refunds,
                   o.shop_id"
        ))
            ->join('orders as o','o.id','=','r.order_id')
            ->join('shops as sh','sh.id','=','o.shop_id')
            ->groupBy('o.shop_id')
            ->whereNull('r.deleted_at')
            ->get();
    }
}
