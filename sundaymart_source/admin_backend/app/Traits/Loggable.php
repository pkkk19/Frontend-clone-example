<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;
use Throwable;

trait Loggable
{

    public function error(Throwable $e)
    {
        Log::error($e->getMessage(), [
            'code' => $e->getCode(),
            'message' => $e->getMessage(),
            'trace' => $e->getTrace(),
            'file' => $e->getFile()
        ]);
    }
}
