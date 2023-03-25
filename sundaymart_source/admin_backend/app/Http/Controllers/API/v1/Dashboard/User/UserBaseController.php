<?php

namespace App\Http\Controllers\API\v1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

abstract class UserBaseController extends Controller
{
    use ApiResponse;

    public function __construct()
    {
        $this->middleware('sanctum.check');
    }
}
