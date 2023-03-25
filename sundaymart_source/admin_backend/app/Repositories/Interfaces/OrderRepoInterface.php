<?php

namespace App\Repositories\Interfaces;

interface OrderRepoInterface
{
    public function ordersList(array $array = []);

    public function ordersPaginate(int $perPage, int $userId = null, array $array = []);

    public function show(int $id, $shopId = null);
}
